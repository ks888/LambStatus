#!/bin/bash

set -e

. $(dirname $0)/../../utils/config.sh

release_cf_template() {
  TEMPLATE_PATH=$1
  VERSION=$2

  aws s3 cp "${TEMPLATE_PATH}" "s3://lambstatus/cf-template/${VERSION}/lamb-status.yml"
}

VERSION=$(cat package.json | jq .version | sed s/\"//g)
release_cf_template "./cloudformation/lamb-status.yml" "${VERSION}"
