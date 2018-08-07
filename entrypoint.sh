#!/bin/sh

yarn

yarn serve &
sleep 1
yarn nightwatch "$@"