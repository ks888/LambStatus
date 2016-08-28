
config() {
  KEY=$1
  CONFIG_JS="$(dirname "${BASH_SOURCE:-$0}")/config.js"

  babel-node ${CONFIG_JS} ${KEY}
}
