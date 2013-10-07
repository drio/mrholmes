#!/usr/bin/env node

var path     = require('path'),
    fs       = require('fs'),
    lib      = path.join(path.dirname(fs.realpathSync(__filename)), '../lib');
    assert   = require('assert'),
    co = require(lib + '/collector');

function pretty(o) {
  console.log(JSON.stringify(o, null, 2));
}

function test_tree() {
  var collector = co.collector(),
      pf_engine = collector.pf_engines.process_file_tree;

  function t_tree(t) {
    //pretty(t);
    var cwd = process.cwd(),
        sp = (cwd + "/test/test_dir").split('/');

    assert(t.name === "/");
    assert(t.children.length === 1);
    t = t.children[0];

    assert(t.name === sp[1]); // Users
    assert(t.children.length === 1);
    t = t.children[0];

    assert(t.name === sp[2]); // drio
    assert(t.children.length === 1);
    t = t.children[0];

    assert(t.name === sp[3]); // dev
    assert(t.children.length === 1);
    t = t.children[0];

    assert(t.name === sp[4]); // mrholmes
    assert(t.children.length === 1);
    t = t.children[0];

    assert(t.name === sp[5]); // test
    assert(t.children.length === 1);
    t = t.children[0];

    assert(t.name === sp[6]); // test_dir
    assert(t.children.length === 3);

    c = t.children;
    assert(c[0].name === "a_link");
    assert(c[0].size === 4);
    assert(c[1].name === "dir1");
    assert(c[1].size === 4);
    assert(c[2].name === "dir2");
    assert(c[2].size === 58);
    t = t.children[2];

    assert(t.name === "dir2"); // dir2
    assert(t.children.length === 1);
    t = t.children[0];

    assert(t.name === "dir21"); // dir2
    assert(t.children.length === 0);
    assert(t.size === 29);
  }

  collector
    .this_dirs([process.cwd() + '/test/test_dir'])
    .run(function(data) {
      //pretty(data);
      t_tree(data);
    }, pf_engine);
}

test_tree();

