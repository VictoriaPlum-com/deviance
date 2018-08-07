const jar = require('selenium-server-standalone-jar');

module.exports = {
    src_folders: 'tests',
    output_folder: 'output',
    globals_path: 'globals.js',
    live_output: true,
    custom_commands_path: [
        'node_modules/@victoriaplum/deviance/dist/commands',
    ],
    custom_assertions_path: [
        'node_modules/@victoriaplum/deviance/dist/assertions',
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
                browserName: 'firefox',
                acceptSslCerts: true,
                javascriptEnabled: true,
                'moz:firefoxOptions': {
                    args: ['-headless', '-private'],
                },
            },
        },
        chrome: {
            desiredCapabilities: {
                browserName: 'chrome',
                chromeOptions: {
                    args: ['--headless', '--no-sandbox', '--incognito'],
                },
                acceptSslCerts: true,
                javascriptEnabled: true,
            },
        },
    },
};
