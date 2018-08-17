module.exports = {
    'New Goat test': function goatTest(browser) {
        browser
            .url(`${browser.launchUrl}/goat.html`)
            .waitForElementPresent('body', 1000)
            .expect.element('h1').text.to.equal('Goat');
        browser
            .verify.elementRegresses('img')
            .verify.elementRegresses('body');
    },
};
