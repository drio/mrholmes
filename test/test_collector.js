#!/usr/bin/env node

var path     = require('path'),
    fs       = require('fs'),
    lib      = path.join(path.dirname(fs.realpathSync(__filename)), '../lib');
    assert   = require('assert'),
    co = require(lib + '/collector');

function pretty(o) {
  console.log(JSON.stringify(o, null, 2));
}

function test_array_of_files() {
  function t_array_of_files(data) {
    var t_files = { 'test/test_dir/a_link/foo.txt' : true,
                    'test/test_dir/dir1/foo.txt' : true,
                    'test/test_dir/file1.txt' : true };

    assert(data.length === 3);
    data.forEach(function(e, i, c) {
      assert(t_files[e.path]);
      assert(e.file === 'f');
    });
  }

  var collector = co.collector(),
      pf_engine = collector.pf_engines.process_file_array;

  collector
    .this_dirs(['test/test_dir'])
    .run(function(data) {
      //console.log(data);
      t_array_of_files(data);
    }, pf_engine);
}

function test_tree() {
  var collector = co.collector(),
      pf_engine = collector.pf_engines.process_file_tree;

  function t_tree(t) {
    pretty(t);
    // /
    assert(t.name === "/", "testing root failed");
    assert(t.children.length === 1, "root has the wrong number of nodes");

    // cd test
    t = t.children[0];
    assert(t.name === "test_dir", "no level1 dir: test_dir");
    assert(t.children.length === 3, "level1 wrong # of nodes");

    // cd test/dir1
    t = t.children;
    _ = { 'a_link':true, 'dir1':true, 'file1.txt':true };
    t.forEach(function(e, i, a) {
      assert(_[e.name], e + "node should not be in test/dir");
    });
  }

  collector
    .this_dirs(['test/test_dir'])
    .run(function(data) {
      //pretty(data);
      t_tree(data);
    }, pf_engine);
}

test_array_of_files();
test_tree();


