"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
function hasProperty(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
}

exports.default = hasProperty;