module.exports = {
    '@tags': ['isolate'],
    'Squirrel test': function squirrelTest(browser) {
        browser
            .url(`${browser.launchUrl}/squirrel.html`)
            .waitForElementPresent('body', 1000)
            .captureElementScreenshot('img', 'all-squirrel')
            .captureElementScreenshot('h1', 'all-h1');
    },
};
