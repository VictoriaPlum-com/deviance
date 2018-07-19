const jar = require('selenium-server-standalone-jar');

module.exports = {
    src_folders: 'tests',
    output_folder: 'output',
    globals_path: 'globals.js',
    selenium: {
        start_process: true,
        server_path: jar.path,
        log_path: '',
        cli_args: {
            'webdriver.chrome.driver': 'node_modules/.bin/chromedriver',
            'webdriver.gecko.driver': 'node_modules/.bin/geckodriver',
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

