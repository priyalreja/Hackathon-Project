const playwright = require('playwright');

(async () => {
  const browser = await playwright.chromium.launch()
  const page = await browser.newPage()
  const seenURLs = new Set()
  const crawl = async (url) => {
    if (seenURLs.has(url)) {
      return
    }
    seenURLs.add(url)
    if (!url.startsWith('https://playwright.dev')) {
      return
    }
    console.log(`Visiting ${url}`)
    await page.goto(url)

    const urls = await page.$$eval('a', (elements) =>
      elements.map((el) => el.href),
    )
    for await (const u of urls) {
      console.log(u);
      await crawl(u)
    }
  }
  await crawl('https://playwright.dev')
  console.log(`Checked ${seenURLs.size} URLs`)
  await browser.close()
})()