function find_children(node, name) {
  for (var i=0; i<node.children.length; ++i)
    if (node.children[i].name === name)
      return node.children[i];
  return null;
}

function create_node(name) {
  return { 'name': name, 'children': [] };
}

exports.d3_tree = function() {
  var tree = create_node('/'),
      root = tree;

  tree.root = function() {
    return root;
  };

  tree.add = function(path) {
    var p_node = root,
        n_node = null,
        found  = null;

    path.split('/').forEach(function(e, i, a) {
      if (i > 0) {
        found = find_children(p_node, e);
        if (found) {
          p_node = found;
        } else {
          n_node = create_node(e);
          p_node.children.push(n_node);
          p_node = n_node;
        }
      }
    });
  };

  return tree;
};


