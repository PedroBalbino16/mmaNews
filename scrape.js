const puppeteer = require("puppeteer");
const fs = require("fs/promises");

async function scrapeNewsTitlesAndDescriptions() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto("https://www.espn.com.br/mma/");

  async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 300;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
                
                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
  }

  // Scroll down to trigger dynamic content loading
  await autoScroll(page);

  // Scrape news titles and descriptions after dynamic content loading
  const newsData = await page.evaluate(() => {
    const titles = Array.from(
      document.querySelectorAll(
        "[class='contentItem__title contentItem__title--story']"
      )
    ).map((x) => x.textContent);

    const descriptions = Array.from(
      document.querySelectorAll(
        "[class='contentItem__subhead contentItem__subhead--story']"
      )
    ).map((x) => x.textContent);

    return titles.map((title, index) => ({
      title,
      description: descriptions[index],
    }));
  });

  // Create a folder for news data
  const folderName = 'news_data';
  await fs.mkdir(folderName, { recursive: true });

  // Save news data as JSON files
  for (let i = 0; i < newsData.length; i++) {
    const newsItem = newsData[i];
    const fileName = `news_${i + 1}.json`;
    const filePath = `${folderName}/${fileName}`;
    const contentToAdd = JSON.stringify(newsItem, null, 2);

    console.log('News', i + 1, ': ', newsItem);

    await fs.writeFile(filePath, contentToAdd);
  }

  await browser.close();
}

scrapeNewsTitlesAndDescriptions();
