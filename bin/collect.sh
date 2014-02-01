#!/bin/bash

usage() {
  local msg=$1
  [ ".$msg" != "." ] && echo ":/ $msg"
  cat << EOF
Usage:
  $ `basename $0` <start_dir>
EOF
  exit 0
}

dir=$1

[ ".$dir"  == "." ]     && usage "Need input directory."
[ ! -d "$dir" ]         && usage "<$dir> is not a directory."
[ `uname` == "Darwin" ] && stat="gstat" || stat=="stat"

header="path size user group t_birth t_access t_modify t_change type n_hard_links"
( for w in $header; do echo -ne "${w}\t"; done) | rev | cut -c 3- | rev

find $dir -print0 | xargs -0 $stat --printf "%n\t%s\t%U\t%G\t%W\t%X\t%Y\t%Z\t%F\t%h\n"
