module.exports = {
    'Grasshopper assertion failure test': function grasshopperTest(browser) {
        browser
            .url(`${browser.launchUrl}/grasshopper.html`)
            .waitForElementPresent('body', 1000)
            .expect.element('h1').text.to.equal('Squirrel');
    },
};
