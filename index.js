const puppeteer = require("puppeteer");
const fs = require("fs/promises");

async function start() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto("https://www.espn.com.br/mma/");

  const newsTitles = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll(
        "[class='contentItem__title contentItem__title--story']"
      )
    ).map((x) => {
      const title = 'title';
      return {
        [title]: x.textContent,
      };
    });
  });

  const folderName = 'news'; // Nome da pasta
  await fs.mkdir(folderName, { recursive: true });

  for (let i = 0; i < newsTitles.length; i++) {
    const newsTitle = newsTitles[i];
    const fileName = `news_${i + 1}.json`;
    const filePath = `${folderName}/${fileName}`;

    const contentToAdd = JSON.stringify(newsTitle, null, 2); // Converte o objeto para JSON formatado

    console.log('News', i + 1, ': ', newsTitle);

    await fs.writeFile(filePath, contentToAdd);
  }

  await browser.close();
}

start();
