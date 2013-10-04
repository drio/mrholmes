#!/usr/bin/env node

var path     = require('path'),
    fs       = require('fs'),
    lib      = path.join(path.dirname(fs.realpathSync(__filename)), '../lib');
    assert   = require('assert'),
    mrholmes = require(lib + '/mrholmes');

function test_array_of_files(data) {
  var t_files = { 'test/test_dir/a_link/foo.txt' : true,
                  'test/test_dir/dir1/foo.txt' : true,
                  'test/test_dir/file1.txt' : true };

  assert(data.length === 3);
  data.forEach(function(e, i, c) {
    assert(t_files[e.path]);
    assert(e.file === 'f');
  });
}

mrholmes.collector()
        .this_dirs(['test/test_dir'])
        .run(function(data) {
          console.log(data);
          test_array_of_files(data);
        });


