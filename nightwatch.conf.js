module.exports = {
    src_folders: 'example/tests',
    output_folder: 'example/output',
    globals_path: 'example/globals.js',
    selenium: {
        start_process: true,
        server_path: 'example/lib/selenium-server-standalone-3.12.0.jar',
        log_path: 'example',
        cli_args: {
            'webdriver.chrome.driver': 'example/lib/chromedriver',
            'webdriver.gecko.driver': 'example/lib/geckodriver',
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

