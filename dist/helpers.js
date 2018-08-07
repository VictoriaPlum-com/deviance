"use strict";

function hasProperty(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
}

module.exports = { hasProperty };