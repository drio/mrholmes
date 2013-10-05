var fs = require('fs'),
    tree = require('./tree');

exports.collector = function() {

  var log             = console.log,
      _collector      = function() {},
      dirs_to_inspect = [],
      data            ;

  function walk(dir, done) {
    var results = [];
    fs.readdir(dir, function(err, list) {
      if (err) return done(err);
      var i = 0;
      (function next() {
        var file = list[i++];
        if (!file) return done(null, results);
        file = dir + '/' + file;
        fs.stat(file, function(err, stat) {
          if (stat && stat.isDirectory()) {
            walk(file, function(err, res) {
              results = results.concat(res);
              next();
            });
          } else {
            results.push(file);
            next();
          }
        });
      })();
    });
  }

  function file_type(stats) {
    var type;
    if (stats.isDirectory())         type = "d";
    else if (stats.isSymbolicLink()) type = "l";
    else if (stats.isFile())         type = "f";
    else type = "?";
    return type;
  }

  function obj_file (f, stats) {
    return {
      'path'  : "" + f,
      'file'  : file_type(stats),
      'user'  : stats.uid,
      'group' : stats.gid,
      'size'  : stats.size,
      'atime' : stats.atime.getTime(),
      'ctime' : stats.ctime.getTime(),
      'mtime' : stats.mtime.getTime()
    };
  }

  _collector.pf_engines = {
    process_file_array: function(f, cb_file_ready) {
      data = data || [];
      f = "" + f;
      fs.stat(f, function(err, stats) {
        if (!err)
          data.push(obj_file(f, stats));
        cb_file_ready(f, err);
      });
    },

    process_file_tree: function(f, cb_file_ready) {
      data = data || tree.d3_tree();
      data.add(f);
      cb_file_ready(f, false);
    }
  };

  // TODO: you may encounter files for which you don't have permissions.
  // walk will return undefined; FIX.
  _collector.run = function(cb_data_ready, pf_engine) {
    dirs_to_inspect.forEach(function(dir, i, a) {
      walk(dir, function(err, files) {
        var nf_stated = [0, 0]; // stated files, error files
        if (!err) {
          files.forEach(function(f, _i, _a) {
            pf_engine(f, function(f, err) {
              if (err) nf_stated[1] += 1;
              else     nf_stated[0] += 1;

              if (nf_stated[0] + nf_stated[1] === files.length)
                cb_data_ready(data);
            });
          });
        }

      });
    });
  };

  // for testing
  _collector.this_dirs = function(dirs) {
    dirs_to_inspect = dirs;
    return _collector;
  };

  // Load dirs to process
  process.argv.forEach(function (val, index, array) {
    if (index > 1)
      dirs_to_inspect.push(val);
  });

  return _collector;
};


