module.exports = {
    'scroll issue': function scrollIssue(browser) {
        const pageObject = browser.page.ScrollExample();
        pageObject
            .navigate()
            .verify.elementRegresses('@menuButton')
            .click('@menuButton')
            .verify.elementRegresses('@mainNav');
    },
};
