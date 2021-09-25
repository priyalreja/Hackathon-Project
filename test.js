const playwright = require('playwright');
const fs = require('fs');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');
// const dayjs = require('dayjs');
const os = require('os');
const crypto = require('crypto');

const url = 'https://bing.com/';   // Change it to example.com in next run to see the diff.. 
const screenshotDir = './snapshots/';
const diffDir = './differenceImages/';
const getUrlHash = x => "59295d81476e284d72904a88fd6472884a223a63dd7a57823b61de023afb6660"; // crypto.createHash('sha256').update(x, 'utf8').digest('hex');
// uncomment the hashing function for getting actual url hash


(async () => {
  const browser = await playwright.chromium.launch();s
  const page = await browser.newPage();

  await page.goto(url);
  //const now = dayjs().unix();
  const tempDir = os.tmpdir();
  const urlHash = getUrlHash(url);
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


  await browser.close();
})();
