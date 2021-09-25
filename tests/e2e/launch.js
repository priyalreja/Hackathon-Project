const playwright = require('playwright');
const { expect } = require('@playwright/test');


(async () => {
  
    const browser = await playwright["firefox"].launch(
        {
            headless:false,
            slowMo:50
        }
    )

    const context = await browser.newContext({});
    const page = await context.newPage();
    
    await page.goto('https://playwright.dev/')
  
    await page.click('text=Get Started')
    //await page.screenshot({ path: 'D:/hackathon doc/get-started12333.png' })

    await page.screenshot({ path: 'D:/Hackathon/sample/test-results/Snaptestmatch/screenshot-getting-started.png' })
   // await page.screenshot({ path: 'screenshot.png' });
    // await page.screenshot({ path: 'D:/hackathon doc/screenshot.png'})
    await expect(await page.screenshot()).toMatchSnapshot('screenshot-getting-started.png');
    await context.close();
    await browser.close();
    
  })();

  