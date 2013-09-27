var fs = require('fs');

exports.collector = function() {

  var log             = console.log,
      _collector      = function() {},
      dirs_to_inspect = [],
      data            = [];

  (function load_dirs_to_inspect() {
    process.argv.forEach(function (val, index, array) {
      if (index > 1)
        dirs_to_inspect.push(val);
    });
  })();

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

  function push_file(f, stats) {
    data.push({
      'path'  : "" + f,
      'file'  : file_type(stats),
      'user'  : stats.uid,
      'group' : stats.gid,
      'size'  : stats.size,
      'atime' : stats.atime.getTime(),
      'ctime' : stats.ctime.getTime(),
      'mtime' : stats.mtime.getTime()
    });
  }

  function process_file(f, cb_file_ready) {
    f = "" + f;
    fs.stat(f, function(err, stats) {
      if (!err)
        push_file(f, stats);
      cb_file_ready(f, err);
    });
  }

  _collector.run = function(cb_data_ready) {
    dirs_to_inspect.forEach(function(dir, i, a) {
      walk(dir, function(err, files) {
        var nf_stated = [0, 0]; // stated files, error files

        if (!err) {
          files.forEach(function(f, _i, _a) {
            process_file(f, function(f, err) {
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

  return _collector;
};



