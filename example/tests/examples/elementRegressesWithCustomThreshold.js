module.exports = {
    '@tags': ['approved'],
    'elementRegresses working with threshold override': function squirrelTest(browser) {
        browser
            .url(`${browser.launchUrl}/squirrel.html`)
            .waitForElementPresent('body', 1000)
            .verify.elementRegresses('h1', 'h1_pass') // will pass as threshold too high
            .verify.elementRegresses('h1', 'h1_fail', 0);// will fail as threshold adjusted
    },
};
