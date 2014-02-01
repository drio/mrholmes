#!/bin/bash

usage="$ `basename $0` <output_dir> <dir_to_collect_data_from>"

src="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source $src/common.sh

outdir=$1
coll_dir=$2

[ ".$outdir"  == "." ] && usage "Need output directory."
[ ! -d "$outdir" ]     && usage "<$outdir> is not a directory."
[ ".$coll_dir"  == "." ] && usage "Need collection directory."
[ ! -d "$coll_dir" ]     && usage "<$coll_dir> is not a directory."

_final_out="$outdir/`date "+%Y/%m"`"

_clean=`echo $coll_dir | sed 's/\//_/g'`
_file="$_final_out/${_clean}.`date "+%d.%m.%Y"`.tsv.gz"

echo "mkdir -p $_final_out; $src/collect.sh $coll_dir  | gzip -c > $_file"

