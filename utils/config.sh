
config() {
  KEY=$1
  CONFIG_JS=$2

  value=$(babel-node ${CONFIG_JS} ${KEY})
  if [ "${KEY}" == "ORIGIN" -a "${value}" == "" ]; then
    value='*'
  fi
  echo ${value}
}
