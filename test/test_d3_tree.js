#!/usr/bin/env node

var path     = require('path'),
    fs       = require('fs'),
    assert   = require('assert'),
    lib      = path.join(path.dirname(fs.realpathSync(__filename)), '../lib');
    tree     = require(lib + '/tree');

function pt(t) {
  console.log(JSON.stringify(t, null, 2));
}

var t = tree.d3_tree();
t.add('/etc');
t.add('/etc/passwd');
t.add('/etc/foo/bar');
pt(t.root());

