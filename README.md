# LambStatus

[![Launch CloudFormation Stack](https://s3.amazonaws.com/cloudformation-examples/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home#/stacks/new?stackName=StatusPage&templateURL=https://s3-ap-northeast-1.amazonaws.com/lambstatus/cf-template/0.4.2/lamb-status.yml)
[![wercker status](https://app.wercker.com/status/fcb6fb7398629e934ae0538737021d14/s/master "wercker status")](https://app.wercker.com/project/byKey/fcb6fb7398629e934ae0538737021d14)
[![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/ks888/LambStatus)
[![API Document](https://img.shields.io/badge/api-v0-blue.svg)](https://lambstatus.github.io/apidocs/)
<a href="https://twitter.com/LambStatus">
  <img src="https://raw.githubusercontent.com/wiki/ks888/LambStatus/images/TwitterButton_h42.png" alt="Twitter" height="20px">
</a>

LambStatus is a serverless status page system inspired by [StatusPage.io](https://www.statuspage.io/).

With a few clicks, You can build a status page like this:

![StatusPage Demo](https://raw.githubusercontent.com/wiki/ks888/LambStatus/images/StatusPageDemo.png)

The demo pages are available:
* [Status page](https://demo-status.lambstatus.org) (the page to tell your service's status to your users)
* [Admin page](https://demo-admin.lambstatus.org) (the page to change your service's status)

## Goals of this project

* Offers an open source and serverless status page system.
* Offers a pay-as-you-go pricing approach like AWS. We estimate the system takes just *$1 to handle 30,000 visitors* ([see details](https://github.com/ks888/LambStatus/wiki/Cost-estimate)).
* Enables you to build and maintain the status page system at minimum effort.

## Why Serverless?

Status page system is great with the Serverless architecture, because:

* It eases your pain caused by the scaling / availability issues. It is terrible if your service is down AND heavy traffic from stuck users stops your status page.
* It enables you to pay only for what you use. A status page only occasionally gets huge traffic. The system takes only $1 per 30,000 visitors and almost $0 if no visitors.

Apart from the Serverless architecture, LambStatus enables you to:

* Build and update the system with a few clicks (by the power of the CloudFormation)
* Choose the AWS region different from your service's region. If both your service and its status page rely on the same region, [the region outage](https://aws.amazon.com/message/41926/) may stop both.

## Installation

Launch your cloudformation stack by clicking the button below:

[![Launch CloudFormation Stack](https://s3.amazonaws.com/cloudformation-examples/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home#/stacks/new?stackName=StatusPage&templateURL=https://s3-ap-northeast-1.amazonaws.com/lambstatus/cf-template/0.4.2/lamb-status.yml)

When a window to create a new CloudFormation stack is opened (like below), click Next.

![CloudFormationWizard1](https://raw.githubusercontent.com/wiki/ks888/LambStatus/images/CloudFormationWizard1.png)

Then, enter your email address and click Next.

![CloudFormationWizard2](https://raw.githubusercontent.com/wiki/ks888/LambStatus/images/CloudFormationWizard2.png)

Click Next again.

![CloudFormationWizard3](https://raw.githubusercontent.com/wiki/ks888/LambStatus/images/CloudFormationWizard3.png)

Check the acknowledgment checkbox at the bottom ([see here](https://github.com/ks888/LambStatus/blob/master/cloudformation/lamb-status.yml#L21-L148) to check IAM resources) and click Create.

![CloudFormationWizard4](https://raw.githubusercontent.com/wiki/ks888/LambStatus/images/CloudFormationWizard4.png)

When the stack is created, the email will be sent to the email address of the initial user. It may take 20-25 minutes, mainly due to the settings of CloudFront Distribution.

![CloudFormationWizard5](https://raw.githubusercontent.com/wiki/ks888/LambStatus/images/CloudFormationWizard5.png)

&nbsp;&nbsp;_NOTE: if you don't receive the email after 30 minutes, check the spam folder. The email comes from `no-reply@verificationemail.com`._

Click the link in the email, and sign in to admin console.

![CloudFormationWizard6](https://raw.githubusercontent.com/wiki/ks888/LambStatus/images/CloudFormationWizard6.png)

See [the demo page](https://demo-admin.lambstatus.org) for the usage example of admin console and [the wiki](https://github.com/ks888/LambStatus/wiki) for advanced usage.

## Join our Community

*LambStatus is still under development, and any contributions are very welcome!*

* Get the release information and interesting topics on [Twitter](https://twitter.com/LambStatus).
* Ask any questions at [Gitter Chatroom](https://gitter.im/ks888/LambStatus)
* Have a feature request or bug report? [Open a new issue](https://github.com/ks888/LambStatus/issues).
* Read our [Contributing Document](https://github.com/ks888/LambStatus/blob/master/CONTRIBUTING.md) to learn how you can start working on the LambStatus yourself.
