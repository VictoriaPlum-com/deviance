module.exports = {
    '@tags': ['isolate'],
    'Squirrel test': function squirrelTest(browser) {
        browser
            .url(`${browser.launchUrl}/squirrel.html`)
            .waitForElementPresent('body', 1000)
            .verify.elementRegresses('img')
            .verify.elementRegresses('img', 'img test')
            .verify.elementRegresses('h1')
            .verify.elementRegresses('h1', 'h1 test')
            .verify.elementRegresses('a[data-at=goat-link]');
    },
};
