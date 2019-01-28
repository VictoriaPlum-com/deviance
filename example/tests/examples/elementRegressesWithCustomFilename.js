module.exports = {
    '@disabled': true,
    '@tags': ['approved'],
    'elementRegresses working with filename override': function squirrelTest(browser) {
        browser
            .url(`${browser.launchUrl}/squirrel.html`)
            .waitForElementPresent('body', 1000)
            .verify.elementRegresses('img', 'image 1') // will generate 'image1.png'
            .verify.elementRegresses('img', 'image 2');// will generate 'image2.png'
    },
};
