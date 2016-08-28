#!/bin/bash

set -e

. $(dirname $0)/../../utils/config.sh

create_stack() {
  put_stack create-stack
}

update_stack() {
  put_stack update-stack
}

put_stack() {
  ACTION=$1
  REGION="$(config "AWS_REGION")"
  STACK_NAME="$(config "CLOUDFORMATION")"
  ORIGIN="$(config "STATUS_PAGE_URL")"
  if [ "${ORIGIN}" == "" ]; then
    ORIGIN='*'
  fi
  TEMPLATE_FILE="$(dirname $0)/../lamb-status.json"

  aws cloudformation ${ACTION} \
      --region ${REGION} \
      --stack-name ${STACK_NAME} \
      --template-body file://${TEMPLATE_FILE} \
      --capabilities CAPABILITY_IAM \
      --parameters \
        ParameterKey=Origin,ParameterValue=${ORIGIN},UsePreviousValue=false
}

delete_stack() {
  REGION=$(config "AWS_REGION")
  STACK_NAME=$(config "CLOUDFORMATION")

  aws cloudformation delete-stack \
      --region $REGION \
      --stack-name $STACK_NAME
}

if [ "$1" = "create" ]; then
  create_stack
elif [ "$1" = "update" ]; then
  update_stack
elif [ "$1" = "delete" ]; then
  delete_stack
else
  echo "Usage: $0 [create|update|delete]"
  exit 1
fi
