const playwright = require('playwright');
const fs = require('fs');
const crypto = require('crypto');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');
const os = require('os');
let screenshotDir = './snapshots/';
let diffDir = './differenceImages/';
const getUrlHash = x => crypto.createHash('sha256').update(x, 'utf8').digest('hex');
let __prevShot;
let __diff;
// uncomment the hashing function for getting actual url hash
async function resolveSnap (url, prevShot, diff) {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();
  await page.goto(url);
  const tempDir = os.tmpdir();
  const urlHash = getUrlHash(url);
  let __newShot = tempDir + '\\' + urlHash + '.png';
  if(prevShot != null)
  {
    screenshotDir = prevShot;
  }

  if(diff != null)
  {
    diffDir = diff;
  }
  
  __prevShot = screenshotDir + urlHash + '.png';
  __diff = diffDir + urlHash + '.png'
      

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
      console.error(`Diff generated for url : ${url} \n  Number of difference(in Pixel):${numDiffPixels}`, __diff, '\n');
    } else {
      console.log('No diff found \n Number of difference(in Pixel):', numDiffPixels, '\n New Images Path:', __newShot, '\n Initial Images Path:', __prevShot, '\n');
    }
  } 
  else {
    __newShot = __prevShot;
    await page.screenshot({path: __newShot});
    console.log('First snapshot taken \n');
  }
  await browser.close();
};
module.exports = {resolveSnap}