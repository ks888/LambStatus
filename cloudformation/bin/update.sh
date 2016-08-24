#!/bin/bash

set -e

. $(dirname $0)/../utils/config.sh

REGION=$(config "AWS_REGION")
STACK_NAME=$(config "CLOUDFORMATION")
ORIGIN=$(config "STATUS_PAGE_URL")
TEMPLATE_FILE="$(dirname $0)/../lamb-status.json"

aws cloudformation update-stack \
    --region ${REGION} \
    --stack-name ${STACK_NAME} \
    --template-body file://${TEMPLATE_FILE} \
    --capabilities CAPABILITY_IAM \
    --parameters \
      ParameterKey=Origin,ParameterValue=$ORIGIN,UsePreviousValue=false
