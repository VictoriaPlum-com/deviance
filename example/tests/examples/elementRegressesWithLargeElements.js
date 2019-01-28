module.exports = {
    '@disabled': true,
    '@tags': ['approved'],
    'elementRegresses on large elements and the document body': function goatTest(browser) {
        browser
            .url(`${browser.launchUrl}/goat.html`)
            .waitForElementPresent('body', 1000)
            .verify.elementRegresses('img')
            .verify.elementRegresses('body');
    },
};
