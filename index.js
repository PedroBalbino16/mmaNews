const puppeteer = require("puppeteer")
const fs = require("fs/promises")

async function start() {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setDefaultNavigationTimeout(0);
  await page.goto("https://www.espn.com.br/mma/")

  //Catch the titles
  const f = await page.$("[class='contentItem__title contentItem__title--hero contentItem__title--story']")
  const text = await (await f.getProperty('textContent')).jsonValue()
  const title = 'Titulo: ';

  const newsTitles = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("[class='contentItem__title contentItem__title--story']")).map(x => x.textContent)
  });
  
  const folderName = 'news'; // Nome da pasta
  await fs.mkdir(folderName, { recursive: true });
  
  for (let i = 0; i < newsTitles.length; i++) {
    const newsTitle = newsTitles[i];
    const fileName = `news_${i+1}.txt`;
    const filePath = `${folderName}/${fileName}`;
    const contentToAdd = `${title}${newsTitle}`
    console.log('News', i+1, ': ', newsTitle)

    fs.writeFile(filePath, contentToAdd)
  }
  await browser.close()
}

start()