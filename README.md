# Deviance

:warning: **Not ready for production use.** Deviance is currently in active development and as such is likely to change. Use at your own peril.

Nightwatch.js reporting tool with extended commands and assertions to perform visual regressions.

## Installation

Using npm:

```bash
$ npm i --save-dev deviance
```

## Usage
### Settings
Nightwatch.js will need to be told to load in the command and assertion provided by Deviance.
To do this, add the following lines to your Nightwatch.js configuration file(s):

```javascript
custom_commands_path: [
    'node_modules/deviance/dist/commands',
],
custom_assertions_path: [
    'node_modules/deviance/dist/assertions',
],
```
Note that these properties accept an array and can be used with other commands and assertions. They should sit at the same depth as `src_folders` within the configuration file. You can read more about configuration settings in the [Nightwatch.js configuration documentation](http://nightwatchjs.org/gettingstarted#settings-file).

Deviance will default to the following settings:

```javascript
const defaultSettings = {
    reporting: {
        enabled: false,
        port: 8083,
    },
    regression: {
        expectedPath: 'tests_output/deviance/regression/expected',
        actualPath: 'tests_output/deviance/regression/actual',
        screenshotsPath: '',
        threshold: 0.05,
        screenshotTimeout: 20000,
    },
};
```
You can modify these settings from within your globals file, as is defined by `globals_path` within your Nightwatch.js configuration file.

```javascript
const Deviance = require('deviance');

/*
 * Deviance can be constructed with settings to fit your requirements.
 * You can override just a single setting, some or all of them.
 */
const deviance = new Deviance({
    reporting: {
        enabled: true,
    },
    regression: {
        expectedPath: 'your/regression/expected/path',
        actualPath: 'your/regression/actual/path',
        screenshotsPath: 'your/nightwatch/screenshots/path',
        threshold: 0.15,
    },
});

/*
 * Then provide Nightwatch.js with the Deviance settings as a global property
 * and optionally define the reporter.
 */
module.exports = {
    deviance: deviance.settings,
    reporter: deviance.reporter,
};

```
In the example above, the Deviance `reporter` is optional, but for Deviance to function `settings` are mandatory.

You can optionally override the `enabled` setting for the report, by setting a node environment variable when running Nightwatch.js:
```node
OPEN_REPORT=false nightwatch
```
### Command
Deviance provides a single command `captureElementScreenshot`, typically its usage would look like this:
```javascript
module.exports = {
    'sample capture element image': function (browser) {
        browser
            .url('http://app.host')
            .waitForElementVisible('body')
            .captureElementScreenshot('.selector')
            .end();
    }
};
``` 
This will also work with named selectors from page objects e.g. `captureElementScreenshot('@selector')`. If no parameter is supplied, it will default to the selector `body`. Any screenshot generated for the body will define it's boundaries from the document scrollWidth and scrollHeight (i.e. the full size of the document).

The command captures the element defined by the selector and saves it to the path defined by the settings. It then checks for an expected image and performs a diff between the two. It performs **no assertions or tests**, but will raise errors should they occur.

By default the image will be named after the selector passed to it, for example `.selector` would be named `selector.png` and `img` would be called `img.png`. The path for saving images is derived from the settings defined in the globals file (or the defaults mentioned above) combined with the test group (the directory structure under test suites root) and the test name. This should hopefully prevent collision of filenames for most tests, however if you do find a collision within a test (capturing an element more than once within the same test) then `captureElementScreenshot` takes an optional second argument:

```javascript
module.exports = {
    'sample capture element image': function (browser) {
        browser
            .url('http://app.host')
            .waitForElementVisible('body')
            .captureElementScreenshot('.selector', 'selector_1')
            .someOperationOn('.selector')
            .captureElementScreenshot('.selector', 'selector_2')
            .end();
    }
};
```
The above will now generate images called `selector_1.png` and `selector_2.png`.

The command will also take an optional third parameter as a function:
```javascript
module.exports = {
    'sample capture element image': function (browser) {
        browser
            .url('http://app.host')
            .waitForElementVisible('body')
            .captureElementScreenshot('.selector', '.selector', function(results) {
                // do stuff
            })
            .end();
    }
};
```
In the above example `results` is an object with the following structure:
```javascript
{
    actual: {
        path: 'output/path/of/captured/image',
        width: 0, // image width as Number
        height: 0, // image height as Number
    },
    // the following are only populated if an expected file exists
    expected: {
        path: 'path/of/expected/image',
        width: 0, // image width as Number
        height: 0, // image height as Number
    },
    diff: {
        path: 'path/of/generated/diff/image',
        percent: 0 // difference in image on a scale from 0 to 1
    },
}
```
### Assertion
Deviance provides a single assertion `elementRegresses`, typically its usage would look like this:
```javascript
module.exports = {
    'sample assert element regresses': function (browser) {
        browser
            .url('http://app.host')
            .waitForElementVisible('body')
            .verify.elementRegresses('img')
            .assert.elementRegresses('h1');
    },
};
```
The assertion (like all Nightwatch.js assertions) will work with verify and assert. It will also work with named selectors from page objects e.g. `elementRegresses('@selector')`. If no parameter is supplied, it will default to the selector `body`.

Internally the assertion uses the `captureElementScreenshot` command and performs some analysis on the results provided. Like the command, it can accept an optional second argument to override the filename of the generated image:

```javascript
module.exports = {
    'sample assert element regresses': function (browser) {
        browser
            .url('http://app.host')
            .waitForElementVisible('body')
            .verify.elementRegresses('div', 'div_1')
            .someActionToElement('div')
            .verify.elementRegresses('div', 'div_2');
    },
};
```
Please read the command information above for reasoning behind this.

Optionally the assertion accepts a third command in the form of a Number between 0 and 1 which allows you to override the defined threshold in the globals file (or the defaults mentioned above) for this one regression assertion. The threshold is the ratio of difference that is deemed tolerable before the test should fail:
```javascript
module.exports = {
    'sample assert element regresses': function (browser) {
        browser
            .url('http://app.host')
            .waitForElementVisible('body')
            .verify.elementRegresses('div', 'div', 0.005); // very strict threshold
    },
};
```
It is advisable to use a very strict threshold for elements where there is a considerably dominant colour. Where possible though we would advise avoiding the use of the regression assertion on elements like this.

## Running in Docker

We explored using Deviance within a Docker image and decided to leave some loose guidance on getting set up with Docker.

We configured our base image with Firefox, Google Chrome, Node.js, Yarn and Java. Within the image we created a volume for our application and a basic entrypoint script that would run `yarn` followed by running Nightwatch.js. As Deviance will generate some files (images for visual regression) we also created a user (`node` in our case) so any files would not be generated as root.
