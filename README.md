# LambStatus

[![Launch CloudFormation Stack](https://s3.amazonaws.com/cloudformation-examples/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home#/stacks/new?stackName=StatusPage&templateURL=https://s3-ap-northeast-1.amazonaws.com/lambstatus/cf-template/0.4.1/lamb-status.yml)
[![wercker status](https://app.wercker.com/status/fcb6fb7398629e934ae0538737021d14/s/master "wercker status")](https://app.wercker.com/project/byKey/fcb6fb7398629e934ae0538737021d14)
[![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/ks888/LambStatus)
<a href="https://twitter.com/LambStatus">
  <img src="https://raw.githubusercontent.com/wiki/ks888/LambStatus/images/TwitterButton_h42.png" alt="Twitter" height="20px">
</a>

LambStatus is a status page system inspired by [StatusPage.io](https://www.statuspage.io/), built on AWS Lambda.

With a few clicks, You can build a status page like this:

![StatusPage Demo](https://raw.githubusercontent.com/wiki/ks888/LambStatus/images/StatusPageDemo.png)

The demo pages are available:
* [Status page](https://lambstatus.github.io/demo-status/) (the page to tell your service's status to your users)
* [Admin page](https://lambstatus.github.io/demo-admin/) (the page to change your service's status)

## Goals of this project

* Offers an open source and serverless status page system.
* Enables you to deploy and maintain the status page system at minimum effort.

## Why Serverless?

Status page system is great with the Serverless architecture, because:

* It dramatically eases your pain caused by the scaling / availability issues. It is terrible if your service is down AND heavy traffic from stuck users stops your status page.
* It reduces your infrastructure cost. A status page usually gets very low traffic and occasionally huge traffic. You only pay for the traffic that you handle.

Apart from the Serverless architecture, LambStatus enables you to:

* Easily build and update the system (by the power of the CloudFormation)
* Choose the AWS region different from your service's region. If both your service and its status page rely on the same region, [the region outage](https://aws.amazon.com/message/41926/) may stop both.

## Installation

Launch your cloudformation stack by clicking the button below:

[![Launch CloudFormation Stack](https://s3.amazonaws.com/cloudformation-examples/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home#/stacks/new?stackName=StatusPage&templateURL=https://s3-ap-northeast-1.amazonaws.com/lambstatus/cf-template/0.4.1/lamb-status.yml)

When a window to create a new CloudFormation stack is opened (like below), click Next.

![CloudFormationWizard1](https://raw.githubusercontent.com/wiki/ks888/LambStatus/images/CloudFormationWizard1.png)

Then, enter your email address and click Next.

![CloudFormationWizard2](https://raw.githubusercontent.com/wiki/ks888/LambStatus/images/CloudFormationWizard2.png)

Click Next again.

![CloudFormationWizard3](https://raw.githubusercontent.com/wiki/ks888/LambStatus/images/CloudFormationWizard3.png)

Check the acknowledgment checkbox at the bottom and click Create.

![CloudFormationWizard4](https://raw.githubusercontent.com/wiki/ks888/LambStatus/images/CloudFormationWizard4.png)

When the stack is created, the email will be sent to the email address of the initial user. It may take 20-25 minutes, mainly due to the settings of CloudFront Distribution.

![CloudFormationWizard5](https://raw.githubusercontent.com/wiki/ks888/LambStatus/images/CloudFormationWizard5.png)

&nbsp;&nbsp;_NOTE: if you don't receive the email after 30 minutes, check the spam folder. The email comes from `no-reply@verificationemail.com`._

Click the link in the email, and sign in to admin console.

![CloudFormationWizard6](https://raw.githubusercontent.com/wiki/ks888/LambStatus/images/CloudFormationWizard6.png)

See [the demo page](https://lambstatus.github.io/demo-admin/) for the usage example of admin console.

## Join our Community

*LambStatus is still under development, and any contributions are very welcome!*

* Get the release information and interesting topics on [Twitter](https://twitter.com/LambStatus).
* Ask any questions at [Gitter Chatroom](https://gitter.im/ks888/LambStatus)
* Have a feature request or bug report? [Open a new issue](https://github.com/ks888/LambStatus/issues).
* Read our [Contributing Document](https://github.com/ks888/LambStatus/blob/master/CONTRIBUTING.md) to learn how you can start working on the LambStatus yourself.
