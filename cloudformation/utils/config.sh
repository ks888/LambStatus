
NODE="$(dirname $0)/../../node_modules/.bin/babel-node"

config() {
  KEY=$1
  CONFIG_JS="$(dirname $0)/../utils/config.js"

  value=$(${NODE} ${CONFIG_JS} ${KEY})
  if [ "${KEY}" == "ORIGIN" -a "${value}" == "" ]; then
    value='*'
  fi
  echo ${value}
}
