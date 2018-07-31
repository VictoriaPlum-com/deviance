module.exports = {
    '@tags': ['isolate'],
    'Squirrel test': function squirrelTest(browser) {
        browser
            .url(`${browser.launchUrl}/squirrel.html`)
            .waitForElementPresent('body', 1000)
            .verify.elementRegresses('img')
            .verify.elementRegresses('h1')
            .verify.elementRegresses('a[data-at=goat-link]');
    },
};
