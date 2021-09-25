// @ts-check
const playwright = require('playwright');
const generateHashCode = require('./generateHashCode');
const { expect } = require('./playwright.config');


async function getLinks (baseurl)
 {
  const browser = await playwright.chromium.launch()
  const page = await browser.newPage()
  const seenURLs = new Set()
  var urlCount=0;
  var hashCodeForSnapShoot=0;
  const crawl = async (url) => {

    if (seenURLs.has(url)) {
      return
    }
    if(urlCount==5)
      return;

    seenURLs.add(url)
    if (!url.startsWith(baseurl)) {
      return
    }
    console.log(`Visiting ${url}\n`)
    await page.goto(url)
    hashCodeForSnapShoot = generateHashCode.urlToHash(url);
    console.log(hashCodeForSnapShoot);

    //await page.screenshot({path:'{hashCodeForSnapShoot}.png'})
    await page.screenshot({ path: `/snapshots/${hashCodeForSnapShoot}.png` })


    const urls = await page.$$eval('a', (elements) =>
      elements.map((el) => el.href),
    )
    urlCount++;
    for await (const u of urls) {
      // console.log(u);
      await crawl(u);
    }

  }

  await crawl(baseurl)
  console.log(`Checked ${seenURLs.size} URLs`)
  await browser.close()
}


module.exports = { getLinks };