const puppeteer = require('puppeteer-core');
const os = require('os');
const path = require('path');
const chrome = require('chrome-cookies-secure'); // Import chrome-cookies-secure

// URL of Google Colab
const url = 'https://colab.research.google.com/#create=true';

async function insertCodeInCell() {
    // Dynamically get the system's username
    const username = os.userInfo().username;

    // Construct the path to the user data directory
    const userDataDir = path.join('C:', 'Users', username, 'AppData', 'Local', 'Google', 'Chrome', 'User Data');

    // Function to get cookies from Chrome
    const getCookies = (callback) => {
        chrome.getCookies(url, 'puppeteer', function(err, cookies) {
            if (err) {
                console.log('Error getting cookies:', err);
                return;
            }
            console.log('Cookies retrieved:', cookies);
            callback(cookies);
        }, 'Person 1'); // Use the correct profile (e.g., 'Profile 1')
    };

    // Get the cookies and proceed with Puppeteer automation
    getCookies(async (cookies) => {
        // Launch Puppeteer with your custom Chrome profile
        const browser = await puppeteer.launch({
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // Path to Chrome binary
            headless: false, // Set to false to see the browser
            // userDataDir: userDataDir, // Use the dynamic user data directory
        });

        const page = await browser.newPage();

        // Set the cookies from the retrieved cookies
        await page.setCookie(...cookies); // Set the cookies in the page

        // Navigate to Google Colab
        await page.goto(url);

        // Wait for the page to load
        const button = await page.waitForSelector('::-p-xpath(//*[@id="toolbar-add-code"])');

        if (button) {
            await button.click();
            console.log("Clicked the Insert Code Cell button!");
        } else {
            console.log("Button not found!");
            await browser.close();
            return;
        }

        // Wait for the new code cell to appear
        await page.waitForTimeout(1000); // Allow some time for the cell to load

        // Locate the code editor of the new cell
        const codeEditorSelector = '.codecell-input-output'; // Ensure this selector is correct for the code editor in Colab
        await page.waitForSelector(codeEditorSelector);

        // Focus on the code editor and type code
        await page.click(codeEditorSelector); // Focus on the editor
        await page.keyboard.type('print("Hello, Google Colab!")'); // Type the code

        console.log("Code inserted into the new cell!");

        // Close the browser after finishing
        await browser.close();
    });
}

insertCodeInCell().catch((error) => {
    console.error("Error inserting code into the cell:", error);
});
