module.exports = {
    '@tags': ['approved'],
    'elementRegresses working with a standard string selector': function squirrelTest(browser) {
        browser
            .url(`${browser.launchUrl}/squirrel.html`)
            .waitForElementPresent('body', 1000)
            .verify.elementRegresses('img') // will generate 'img.png'
            .verify.elementRegresses('h1') // will generate 'h1.png'
            .verify.elementRegresses('a[data-at=goat-link]'); // will generate 'a-data-at-goat-link-.png'
    },
};
