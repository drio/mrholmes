#!/usr/bin/env node

var path     = require('path'),
    fs       = require('fs'),
    lib      = path.join(path.dirname(fs.realpathSync(__filename)), '../lib');
    mrholmes = require(lib + '/collector');

var t = process.hrtime(),
    collector = mrholmes.collector(),
    pf_engine = collector.pf_engines.process_file_tree;

function ready(data) {
  process.stderr.write('>> # of files: ' + data.length + "\n");
  console.log(JSON.stringify(data, null, 2));
  process.stderr.write('>> Elapse time: ' + process.hrtime(t)[0] + " secs\n");
}

collector.run(ready, pf_engine);
