# deviance
NightwatchJS reporting tool

## Usage
The app contains an example usage of NightwatchJS, complete with example HTML files (should help with setup and development).

* `yarn build` will compile any changes to the src dir to dist
* `yarn watch` will do as above but watch files and update for live changes
* `yarn server` will start the server the basic http server for the example site
* `yarn nightwatch` will run the "build" mentioned above and run nightwatch on the example site. You can run `yarn server` in a separate process and reuse this command if you want
* `yarn runExample` will run the server, build the files and run nightwatch and terminate all processes once complete
* `runExample:chrome` will run nightwatch using the "chrome" environment as defined in the nightwatch configuration
