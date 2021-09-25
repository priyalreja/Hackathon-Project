// @ts-check
const playwright = require('playwright');
async function getLinks(baseurl) {
  const browser = await playwright.chromium.launch()
  const page = await browser.newPage()
  const urlsWithLevel = new Array([baseurl]);
  const seenURLs = new Set()
  const crawl = async (url, level) => {
    if (seenURLs.has(url)) {
      return
    }

    seenURLs.add(url);

    if (!url.startsWith(baseurl)) {
      return
    }
    const links = await extractLinks(url);
    console.log(`Visiting ${url} link count${links.length}`)

    if (links.length > 0) {
      if (urlsWithLevel.length > 0 && urlsWithLevel[level] != undefined)
        urlsWithLevel[level] = [...urlsWithLevel[level], ...links];
      else
        urlsWithLevel[level] = links;
    }

    for (let index = 0; index < links.length; index++) {
      const link = links[index];
      await crawl(link, level + 1);
    }
  }

  const extractLinks = async (url) => {
    await page.goto(url, { timeout: 0 })
    const urls = await page.$$eval('a', (elements) =>
      elements.map((el) => el.href),
    )
    return urls;
  }

  await crawl(baseurl, 1);

  // console.log(`Checked ${seenURLs.size} URLs`)
  // seenURLs.forEach(url => {
  //   console.log(url);
  // });
  // console.log(`total levels found ${urlsWithLevel.length}`)
  // for (let index = 0; index < urlsWithLevel.length; index++) {
  //   console.log(`for level ${index} =>`);
  //   urlsWithLevel[index].forEach(url => {
  //     console.log(url);
  //   });
  // }
  await browser.close()
  return urlsWithLevel;
}

module.exports = { getLinks };