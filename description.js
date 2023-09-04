const puppeteer = require("puppeteer")
const fs = require("fs/promises")

async function start() {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setDefaultNavigationTimeout(0);
  await page.goto("https://www.espn.com.br/mma/")

  const f = await page.$("[class='contentItem__subhead contentItem__subhead--story']")
  const text = await (await f.getProperty('textContent')).jsonValue()

  const newsDescriptions = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("[class='contentItem__subhead contentItem__subhead--story']")).map(x => x.textContent)
  });
  const description = 'Descrição:\n';
  
  const folderName = 'news'; // Nome da pasta

  for (let i = 0; i < newsDescriptions.length; i++) {
    const newsDescription = newsDescriptions[i];
    const fileName = `news_${i+1}.txt`;
    const filePath = `${folderName}/${fileName}`;
    const contentToAdd = `\n\n${description}${newsDescription}`
    console.log('News', i+1, ': ', newsDescription)

    await fs.appendFile(filePath, contentToAdd)
  }

  await browser.close()
}

start()
