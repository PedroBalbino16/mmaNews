
// in a new folder be sure to run "npm init -y" and "npm install puppeteer"
const puppeteer = require("puppeteer")
const fs = require("fs/promises")


async function start() {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setDefaultNavigationTimeout(0);
  await page.goto("https://www.espn.com.br/mma/")


  const f = await page.$("[class='contentItem__title contentItem__title--hero contentItem__title--story']")
  const text = await (await f.getProperty('textContent')).jsonValue()
  const newsTitles = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("[class='contentItem__title contentItem__title--story']")).map(x => x.textContent)
   })
   for (var i = 0; i < newsTitles.length; i++) {
    console.log("\nNoticia ",i,": ",newsTitles[i]);
  }

  await page.goto("https://a.espncdn.com/photo/2023/0820/r1213169_1296x729_16-9.jpg")

  const photos = await page.$$eval("img", imgs => {
    return imgs.map(x => x.src);
  });

  for (const photo of photos) {
    const imagePage = await page.goto(photo)
    const filename = photo.split('/').pop()
    await fs.writeFile(filename, await imagePage.buffer())
  }


  await browser.close()
}

start()