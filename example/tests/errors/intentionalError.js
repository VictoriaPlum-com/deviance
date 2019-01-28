module.exports = {
    '@disabled': true,
    '@tags': ['approved'],
    'Squirrel test': function squirrelTest(browser) {
        browser
            .url(`${browser.launchUrl}/squirrel.html`)
            .waitForElementPresent('body', 1000)
            .expect.element('h1').text.to.equal('Squirrel');
    },
    'Forced error test': function grasshopperTest(browser) {
        browser
            .url(`${browser.launchUrl}/grasshopper.html`)
            .waitForElementPresent('body', 1000)
            .expect.element('h1').text.to.equal('Grasshopper')
            // intentional error
            .elementRegresses('img');
    },
    'Squirrel test 2': function squirrelTest(browser) {
        browser
            .url(`${browser.launchUrl}/squirrel.html`)
            .waitForElementPresent('body', 1000)
            .expect.element('h1').text.to.equal('Squirrel');
    },
};
