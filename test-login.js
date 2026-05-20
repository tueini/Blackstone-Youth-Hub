const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
    page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

    await page.goto('http://localhost:5003/admin/', { waitUntil: 'networkidle0' });
    
    await page.select('#login-role', 'Teachers');
    await page.type('#login-password', 'bringbread');
    await page.click('#login-btn');
    
    // Wait a bit to see if anything happens
    await new Promise(r => setTimeout(r, 2000));
    
    const isHidden = await page.$eval('#login-view', el => el.classList.contains('hidden'));
    console.log("Login view hidden?", isHidden);
    
    await browser.close();
})();
