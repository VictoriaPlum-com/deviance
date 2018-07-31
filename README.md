# Deviance

NightwatchJS reporting tool

## Contents

The app proper exists at the top level, it includes a few commands for processing code through babel. It includes a nested directory labelled `example` that includes an example site for running Deviance with NightwatchJS.

http-server is configured to use port 8069.

## Setup

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
        outputPath: 'tests_output/deviance/report',
    },
    regression: {
        expectedPath: 'tests_output/deviance/regression/expected',
        actualPath: 'tests_output/deviance/regression/actual',
        threshold: 0.1,
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
        outputPath: 'your/report/path',
    },
    regression: {
        expectedPath: 'your/regression/expected/path',
        actualPath: 'your/regression/actual/path',
        threshold: 0.15,
    },
});

/*
 * Then we provide NightwatchJS with the deviance settings as a global property
 * and define the reporter. You do not have to use the deviance reporter, but the
 * settings are mandatory for deviance to function
 */
module.exports = {
    deviance: deviance.settings,
    reporter: deviance.reporter,
};

```

## Example Usage 

-   Deviance
    -   `yarn build` will compile any changes to the src dir to dist
    -   `yarn watch` will do as above but watch files and update for live changes
-   Example (run from within the example directory)
    -   `yarn server` will start the server the basic http server for the example site. This must be run first as a separate process before `yarn nightwatch` can be used
    -   `yarn sym` will symlink the example dependency to `deviance`, this for for internal steps only and can be ignored
    -   `yarn bump` will upgrade `deviance`
    -   `yarn nightwatch` will run nightwatch on the example site. You can run `yarn server` in a separate process and reuse this command if you want

It is worth noting that you will probably want to have an active watcher running, or remember to build before running tests in example.
