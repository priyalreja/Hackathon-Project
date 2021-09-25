// @ts-check
const playwright = require('playwright');
const crypto = require('crypto');
const fs = require('fs');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');
const os = require('os');

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
    //console.log(`Visiting ${url} link count${links.length}`)

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

  console.log(`Checked ${seenURLs.size} URLs`)
  seenURLs.forEach(url => {
    console.log(url);
  });
  console.log(`total levels found ${urlsWithLevel.length}`)
  for (let index = 0; index < urlsWithLevel.length; index++) {
    console.log(`for level ${index} =>`);
    urlsWithLevel[index].forEach(url => {
      console.log(url);
    });
  }
  await browser.close()
  return urlsWithLevel;
}

const getUrlHashCode = (url) => {
  return(crypto.createHash(url));
}


const comparingSnapshots = () => {
  const screenshotDir = './snapshots/';
  const diffDir = './differenceImages/';
  const tempDir = os.tmpdir();
  const urlHash = getUrlHashCode(url);
  let __newShot = tempDir + urlHash + '.png';
  let __prevShot = screenshotDir + urlHash + '.png';
  const __diff = diffDir + urlHash + '.png'

  if(fs.existsSync(__prevShot)) {    
    const prevShot = PNG.sync.read(fs.readFileSync(__prevShot));

    await page.screenshot({path: __newShot});
    const prevShotPng = PNG.sync.read(fs.readFileSync(__prevShot));
    const newShotPng = PNG.sync.read(fs.readFileSync(__newShot));
    
    const {width, height} = prevShotPng;
    const diff = new PNG({width, height});
    const numDiffPixels = pixelmatch(prevShotPng.data, newShotPng.data, diff.data, width, height, {threshold: 0.1});

    if(numDiffPixels !== 0) {
      if (!fs.existsSync(diffDir)){
        fs.mkdirSync(diffDir);
      }
      fs.writeFileSync(__diff, PNG.sync.write(diff));
      console.log('Diff generated:', __diff);
    } else {
      console.log('No diff found', numDiffPixels, __newShot, __prevShot);
    }
  } 
  else {
    __newShot = __prevShot;
    await page.screenshot({path: __newShot});
    console.log('First snapshot taken');
  }
}
module.exports = { getLinks };