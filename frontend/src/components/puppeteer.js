const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

(async () => {
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // Path to Chrome
        headless: false, // Run in visible mode
        args: ['--start-maximized'], // Maximize browser window
        defaultViewport: null, // Use full viewport
    });

    const page = await browser.newPage();
    await page.setBypassCSP(true)
    // Set a realistic user agent
    await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36'
    );

    // Navigate to Google Colab
    await page.goto('https://colab.research.google.com/#create=true', {
        waitUntil: 'networkidle2', // Wait for the page to fully load
    });

    console.log('Please log in manually...');
    
    // Wait until the login is detected
    try {
        await page.waitForSelector('#toolbar-add-code', { timeout: 120000 }); // Wait for the "Insert Code Cell" button
        console.log('Login successful!');
    } catch (error) {
        console.error('Login process took too long or failed.');
        await browser.close();
        return;
    }

    // Insert code into the first cell
    const button = await page.$('#toolbar-add-code');
    if (button) {
        await button.click();
        console.log("Clicked the 'Insert Code Cell' button!");
    } else {
        console.error("Button not found!");
        await browser.close();
        return;
    }

    const codeEditorSelector = '.codecell-input-output';
    await page.waitForSelector(codeEditorSelector);
    await page.click(codeEditorSelector);
    await page.keyboard.type('print("Hello, Google Colab!")');
    console.log('Code inserted into the new cell!');

    await browser.close();
})();
