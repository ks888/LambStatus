#!/bin/bash

set -e

release_cf_template() {
  TEMPLATE_PATH=$1
  VERSION=$2

  aws s3 cp "${TEMPLATE_PATH}" "s3://lambstatus/cf-template/${VERSION}/lamb-status.yml"
}

PACKAGE_JSON="$(dirname $0)/../../package.json"
VERSION=$(cat "${PACKAGE_JSON}" | sed -n 's/.*\"version\": \"\(.*\)\".*/\1/p')
release_cf_template "./cloudformation/lamb-status.yml" "${VERSION}"
