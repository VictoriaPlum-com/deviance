# Deviance

NightwatchJS reporting tool

## Contents

The app proper exists at the top level, it includes a few commands for processing code through babel. It includes a nested directory labelled `example` that includes an example site for running Deviance with NightwatchJS.

http-server is configured to use port 8069.

## Usage

-   Deviance
    -   `yarn build` will compile any changes to the src dir to dist
    -   `yarn watch` will do as above but watch files and update for live changes
-   Example (run from within the example directory)
    -   `yarn server` will start the server the basic http server for the example site. This must be run first as a separate process before `yarn nightwatch` can be used
    -   `yarn sym` will symlink the example dependency to `deviance`, this for for internal steps only and can be ignored
    -   `yarn bump` will upgrade `deviance`
    -   `yarn nightwatch` will run nightwatch on the example site. You can run `yarn server` in a separate process and reuse this command if you want

It is worth noting that you will probably want to have an active watcher running, or remember to build before running tests in example.
