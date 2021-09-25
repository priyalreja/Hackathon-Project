// @ts-check
const playwright = require('playwright');

async function getLinks (baseurl)
 {
  const browser = await playwright.chromium.launch()
  const page = await browser.newPage()
  const seenURLs = new Set()
  const crawl = async (url) => {

    if (seenURLs.has(url)) {
      return
    }
    seenURLs.add(url)
    if (!url.startsWith(baseurl)) {
      return
    }
    console.log(`Visiting ${url}\n`)
    await page.goto(url)
    const urls = await page.$$eval('a', (elements) =>
      elements.map((el) => el.href),
    )
    for await (const u of urls) {
      console.log(u);
      await crawl(u);
    }
  }

  await crawl(baseurl)
  console.log(`Checked ${seenURLs.size} URLs`)
  await browser.close()
}

module.exports = { getLinks };