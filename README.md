# LambStatus

[![Launch CloudFormation Stack](https://s3.amazonaws.com/cloudformation-examples/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new?stackName=StatusPage&templateURL=https://s3-ap-northeast-1.amazonaws.com/lambstatus/cf-template/0.0.1/lamb-status.yml)

LambStatus is a status page system inspired by [StatusPage.io](https://www.statuspage.io/), built on AWS Lambda.

With a few clicks, You can build a status page like this:

![StatusPage Demo](https://raw.githubusercontent.com/wiki/ks888/LambStatus/images/StatusPageDemo1.png)

## Why Serverless?

Status page system is able to utilize the benefits of Serverless architectures, because:

* it eases your pain caused by the scaling / availability issues. It is a worst situation if your service is down AND heavy traffic from stuck users stops your status page.

* it reduces your infrastructure cost. A status page usually gets very low traffic and occasionally huge traffic. You only pay for the traffic that you handle.

## Features

* Easy build: launch the cloudformation stack using [this template](https://s3-ap-northeast-1.amazonaws.com/lambstatus/cf-template/0.0.1/lamb-status.yml) and that's it!
* Components: show your service's status by components
* Incidents: open an incident and keep updating situations

*Note: LambStatus is still under development, and not ready for production use. Opening an issue / PR for feature request / bug report is welcome!*

## Requirement

* AWS Account

## Installation

Launch your cloudformation stack by clicking the button below:

[![Launch CloudFormation Stack](https://s3.amazonaws.com/cloudformation-examples/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new?stackName=StatusPage&templateURL=https://s3-ap-northeast-1.amazonaws.com/lambstatus/cf-template/0.0.1/lamb-status.yml)

The stack will be created in 20-25 minutes. It is mainly due to the creation of CloudFront Distribution.

## Usage
