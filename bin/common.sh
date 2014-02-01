usage() {
  local msg=$1
  [ ".$msg" != "." ] && echo ":/ $msg"
  echo $usage
  exit 0
}

