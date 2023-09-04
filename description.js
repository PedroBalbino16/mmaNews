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
    return Array.from(
      document.querySelectorAll(
        "[class='contentItem__subhead contentItem__subhead--story']"
      )
    ).map((x) => {
      const description = 'description';
      return {
        [description]: x.textContent,
      };
    });
  });
  
  const folderName = 'news'; // Nome da pasta

  for (let i = 0; i < newsDescriptions.length; i++) {
    const newsDescription = newsDescriptions[i];
    const fileName = `news_${i+1}.json`;
    const filePath = `${folderName}/${fileName}`;
    const contentToAdd = JSON.stringify(newsDescription, null, 2);
    console.log('News', i+1, ': ', newsDescription)

    await fs.appendFile(filePath, contentToAdd)
  }

  await browser.close()
}

start()
