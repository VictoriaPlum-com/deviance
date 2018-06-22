module.exports = {
    src_folders: `${__dirname}/tests`,
    output_folder: `${__dirname}/output`,
    globals_path: 'globals.js',
    selenium: {
        start_process: true,
        server_path: `${__dirname}/lib/selenium-server-standalone-3.12.0.jar`,
        log_path: `${__dirname}`,
        cli_args: {
            'webdriver.chrome.driver': `${__dirname}/lib/chromedriver`,
        },
    },
    test_settings: {
        default: {
            launch_url: 'http://localhost:8080',
        },
        chrome: {
            desiredCapabilities: {
                browserName: 'chrome',
                chromeOptions: ['--no-sandbox'],
            },
        },
    },
};

