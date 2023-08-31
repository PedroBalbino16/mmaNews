const puppeteer = require("puppeteer")
const fs = require("fs/promises")
const util = require('util'); // Importe o módulo util
const writeFileAsync = util.promisify(fs.writeFile);

async function start() {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setDefaultNavigationTimeout(0);
  await page.goto("https://www.espn.com.br/mma/")


  const f = await page.$("[class='contentItem__title contentItem__title--hero contentItem__title--story']")
  const text = await (await f.getProperty('textContent')).jsonValue()

  const newsTitles = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("[class='contentItem__title contentItem__title--story']")).map(x => x.textContent)
  });
  
  const folderName = 'news'; // Nome da pasta
  await fs.mkdir(folderName, { recursive: true });
  
  for (let i = 0; i < newsTitles.length; i++) {
    const newsTitle = newsTitles[i];
    const fileName = `noticia_${i}.txt`;
    const filePath = `${folderName}/${fileName}`;
    console.log('News', i, ': ', newsTitle)

    fs.writeFile(filePath, newsTitle)
  }
  await browser.close()
}

start()