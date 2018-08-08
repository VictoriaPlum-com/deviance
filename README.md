# Deviance

:warning: **Not ready for production use.** Deviance is currently in active development and as such is likely to change. Use at your own peril.

NightwatchJS reporting tool with extended commands and assertions to perform visual regressions. 

## Installation

Using npm:

```bash
$ npm i --save-dev deviance
```

## Usage
### Settings
NightwatchJS will need to be told to load in the command and assertion provided by Deviance.
To do this add the following lines to your NightwatchJS configuration file(s):

```javascript
custom_commands_path: [
    'node_modules/deviance/dist/commands',
],
custom_commands_path: [
    'node_modules/deviance/dist/assertions',
],
```
Note that these properties accept an array and can be used with other commands and assertions. They should sit at the same depth as `src_folders` within the configuration file. You can read more about configuration settings in the [NightwatchJS configuration documentation](http://nightwatchjs.org/gettingstarted#settings-file). 

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
        threshold: 0.05,
    },
};
```
You can modify these settings from within your globals file, as is defined by `globals_path` within your NightwatchJS configuration file.

```javascript
const Deviance = require('deviance');

/*
 * Deviance can be constructed with settings to fit your requirements.
 * You can override just a single settings, some or all of them. 
 */
const deviance = new Deviance({
    reporting: {
        enabled: true,
    },
    regression: {
        expectedPath: 'your/regression/expected/path',
        actualPath: 'your/regression/actual/path',
        threshold: 0.15,
    },
});

/*
 * Then provide NightwatchJS with the Deviance settings as a global property
 * and optionally define the reporter.
 */
module.exports = {
    deviance: deviance.settings,
    reporter: deviance.reporter,
};

```
In the example above, the Deviance `reporter` is optional, but for Deviance to function `settings` are mandatory.

You can optionally override the `enabled` setting for the report, by setting a node environment variable when running NightwatchJS.
```node
OPEN_REPORT=false nightwatch
```
### Command
Deviance provides a single command `captureElementScreenshot`, typically it's usage would look like this:
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
This will also work with named selectors from pages objects e.g. `captureElementScreenshot('@selector')`.

The command captures the element defined by the selector and saves it to the path defined by the settings. It then checks for an expected image and performs a diff between the two. It performs **no assertions or tests** but will raise errors should they occur.

By default the image will be named after the selector passed to it, for example `.selector` would be named `selector.png` and `img` would be called `img.png`. The path for saving images is derived from the settings defined in globals file (or the defaults mentioned above) combined with the the test group (the directory structure under test suites root) and the test name. This should hopefully prevent collision of filenames for most tests, however if you do find collision within a test (capturing an element more than once within the same test) then `captureElementScreenshot` takes an optional second argument:

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
The above will now generate images called `selector_1.png`, `selector_2.png`.

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
Deviance provides a single assertion `elementRegresses`, typically it's usage would look like this:
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
The assertion (like all NightwatchJS assertions) will work with verify and assert. It will also work with named selectors from pages objects e.g. `elementRegresses('@selector')`.

Internally the assertion uses the `captureElementScreenshot` command and performs some analysis on the results provided. Like the command, it can accept an optional second argument to override the filename of the generated image.
Deviance provides a single assertion `elementRegresses`, typically it's usage would look like this:
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

Optionally the assertion accepts a third command in the form of a Number between 0 and 1 which allows you to override the defined threshold in the globals file (or the defaults mentioned above) for this one regression assertion. The threshold is the ratio of difference that is deemed tolerable before the test should fail.
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

We explored using Deviance within a docker image and decided to leave some loose guidance on getting setup with Docker.

We configured our base image with Firefox, Google Chrome, NodeJS, Yarn and Java. Within the image we created a volume for our application and a basic entrypoint script that would install run `yarn` followed by running NightwatchJS. As Deviance will generate some files (images for visual regression) we also created a user (`node` in our case) so any files would not be generated as root.

