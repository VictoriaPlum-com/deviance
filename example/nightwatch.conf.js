module.exports = {
    src_folders: 'tests',
    output_folder: 'output',
    globals_path: 'globals.js',
    selenium: {
        start_process: true,
        server_path: 'lib/selenium-server-standalone-3.12.0.jar',
        log_path: '',
        cli_args: {
            'webdriver.chrome.driver': 'lib/chromedriver',
            'webdriver.gecko.driver': 'lib/geckodriver',
        },
    },
    test_settings: {
        default: {
            launch_url: 'http://localhost:8080',
            desiredCapabilities: {
                browserName: 'firefox',
            },
        },
        chrome: {
            desiredCapabilities: {
                browserName: 'chrome',
            },
        },
    },
};

