module.exports = {
    'Squirrel test': function squirrelTest(browser) {
        browser
            .url(`${browser.launchUrl}/squirrel.html`)
            .waitForElementPresent('body', 1000)
            .expect.element('h1').text.to.equal('Squirrel');
    },
    'Squirrel test 2': function squirrelTest(browser) {
        browser
            .url(`${browser.launchUrl}/squirrel.html`)
            .waitForElementPresent('body', 1000)
            .expect.element('h1').text.to.equal('Squirrel');
    },
};
