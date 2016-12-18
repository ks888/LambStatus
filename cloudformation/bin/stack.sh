#!/bin/bash

set -e

. $(dirname $0)/../../.env

create_stack() {
  put_stack create-stack
}

update_stack() {
  put_stack update-stack
}

put_stack() {
  ACTION=$1
  TEMPLATE_FILE="$(dirname $0)/../lamb-status.yml"
  PACKAGE_JSON="$(dirname $0)/../../package.json"
  VERSION=$(cat "${PACKAGE_JSON}" | sed -n 's/.*\"version\": \"\(.*\)\".*/\1/p')

  if [ "${USER_EMAIL}" == "" ]; then
    echo "Error: set USER_EMAIL at .env file"
    exit 1
  fi

  aws cloudformation ${ACTION} \
      --region ${AWS_REGION} \
      --stack-name ${STACK_NAME} \
      --template-body file://${TEMPLATE_FILE} \
      --capabilities CAPABILITY_IAM \
      --parameters \
        ParameterKey=ServiceName,ParameterValue=${SERVICE_NAME},UsePreviousValue=false \
        ParameterKey=Version,ParameterValue=${VERSION},UsePreviousValue=false \
        ParameterKey=UserName,ParameterValue=${USER_NAME},UsePreviousValue=false \
        ParameterKey=UserEmail,ParameterValue=${USER_EMAIL},UsePreviousValue=false
}

delete_stack() {
  aws cloudformation delete-stack \
      --region $AWS_REGION \
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
