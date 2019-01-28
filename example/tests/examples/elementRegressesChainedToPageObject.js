module.exports = {
    '@disabled': true,
    '@tags': ['current'],
    'using page objects with elementRegresses': function goatTest(browser) {
        const pageObject = browser.page.samplePageObject();

        pageObject
            .navigate()
            .waitForElementPresent('@context', 1000)
            .verify.elementRegresses('@image')
            .verify.elementRegresses('@context');
    },
};
