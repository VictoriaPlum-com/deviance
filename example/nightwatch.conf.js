const jar = require('selenium-server-standalone-jar');

module.exports = {
    src_folders: 'tests',
    output_folder: 'output',
    globals_path: 'globals.js',
    live_output: true,
    page_objects_path: [
        'page-objects',
    ],
    custom_commands_path: [
        'node_modules/deviance/dist/commands',
    ],
    custom_assertions_path: [
        'node_modules/deviance/dist/assertions',
    ],
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
            launch_url: 'http://localhost:8069',
            desiredCapabilities: {
                browserName: 'chrome',
            },
        },
        chrome: {
            desiredCapabilities: {
                browserName: 'chrome',
            },
        },
    },
};
