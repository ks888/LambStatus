# LambStatus

[![Launch CloudFormation Stack](https://s3.amazonaws.com/cloudformation-examples/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home#/stacks/new?stackName=StatusPage&templateURL=https://s3-ap-northeast-1.amazonaws.com/lambstatus/cf-template/0.0.1/lamb-status.yml)
[![wercker status](https://app.wercker.com/status/fcb6fb7398629e934ae0538737021d14/s/master "wercker status")](https://app.wercker.com/project/byKey/fcb6fb7398629e934ae0538737021d14)

LambStatus is a status page system inspired by [StatusPage.io](https://www.statuspage.io/), built on AWS Lambda.

With a few clicks, You can build a status page like this:

![StatusPage Demo](https://raw.githubusercontent.com/wiki/ks888/LambStatus/images/StatusPageDemo1.png)

## Why Serverless?

Status page system is able to utilize the benefits of Serverless architectures, because:

* it eases your pain caused by the scaling / availability issues. It is a worst situation if your service is down AND heavy traffic from stuck users stops your status page.

* it reduces your infrastructure cost. A status page usually gets very low traffic and occasionally huge traffic. You only pay for the traffic that you handle.

## Features

* Easy build: launch the cloudformation stack using [this template](https://s3-ap-northeast-1.amazonaws.com/lambstatus/cf-template/0.0.1/lamb-status.yml) and that's it!
* Component management: show your service's current status by components
* Incident management: when an incident occurs, keep telling latest situations to users

*Note: LambStatus is still under development, and not ready for production use. Opening an issue / PR for feature request / bug report is welcome!*

## Requirement

* AWS Account

## Installation

Launch your cloudformation stack by clicking the button below:

[![Launch CloudFormation Stack](https://s3.amazonaws.com/cloudformation-examples/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home#/stacks/new?stackName=StatusPage&templateURL=https://s3-ap-northeast-1.amazonaws.com/lambstatus/cf-template/0.0.1/lamb-status.yml)

When a window to create a new CloudFormation stack is opened (like below), click Next.

![CloudFormationWizard1](https://raw.githubusercontent.com/wiki/ks888/LambStatus/images/CloudFormationWizard1.png)

Then, enter the name of your service and click Next.

![CloudFormationWizard2](https://raw.githubusercontent.com/wiki/ks888/LambStatus/images/CloudFormationWizard2.png)

Click Next again, and check the acknowledgment checkbox and click Create.

![CloudFormationWizard3](https://raw.githubusercontent.com/wiki/ks888/LambStatus/images/CloudFormationWizard3.png)

![CloudFormationWizard4](https://raw.githubusercontent.com/wiki/ks888/LambStatus/images/CloudFormationWizard4.png)

The stack will be created in 20-25 minutes (it is mainly due to the creation of CloudFront Distribution).

## Usage

After the stack creation, see the `Outputs` of the stack and access the URL to which `StatusPageCloudFrontURL` specifies. You will get your status page.

![CloudFormationWizard5](https://raw.githubusercontent.com/wiki/ks888/LambStatus/images/CloudFormationWizard5.png)

As well, access the URL to which `AdminPageCloudFrontURL` specifies, then your admin page is there.
