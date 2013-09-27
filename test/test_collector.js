#!/usr/bin/env node

var path     = require('path'),
    fs       = require('fs'),
    lib      = path.join(path.dirname(fs.realpathSync(__filename)), '../lib');
    assert   = require('assert'),
    mrholmes = require(lib + '/mrholmes');

assert(true, 'Great');



