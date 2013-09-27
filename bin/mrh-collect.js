#!/usr/bin/env node

var path     = require('path'),
    fs       = require('fs'),
    lib      = path.join(path.dirname(fs.realpathSync(__filename)), '../lib');
    mrholmes = require(lib + '/mrholmes');

var t = process.hrtime();
mrholmes.collector().run(function(data) {
  process.stderr.write('>> # of files: ' + data.length + "\n");
  console.log(JSON.stringify(data));
  process.stderr.write('>> Elapse time: ' + process.hrtime(t)[0] + " secs\n");
});
