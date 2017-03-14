# LambStatus

[![Launch CloudFormation Stack](https://s3.amazonaws.com/cloudformation-examples/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home#/stacks/new?stackName=StatusPage&templateURL=https://s3-ap-northeast-1.amazonaws.com/lambstatus/cf-template/0.2.0/lamb-status.yml)
[![wercker status](https://app.wercker.com/status/fcb6fb7398629e934ae0538737021d14/s/master "wercker status")](https://app.wercker.com/project/byKey/fcb6fb7398629e934ae0538737021d14)

LambStatus is a status page system inspired by [StatusPage.io](https://www.statuspage.io/), built on AWS Lambda.

With a few clicks, You can build a status page like this:

![StatusPage Demo](https://raw.githubusercontent.com/wiki/ks888/LambStatus/images/StatusPageDemo_v2.0.0.png)

The demo pages are available:
* [Status page](https://lambstatus.github.io/demo-status/) (the page to tell your service's status to your users)
* [Admin page](https://lambstatus.github.io/demo-admin/) (the page to change your service's status)

## Goals of this project

* Offer an open source status page system
* Enable users to easily build and update the status page system (by fully utilizing the CloudFormation)
* Serverless architectures

## Why Serverless?

Status page system is able to make use of the benefits of Serverless architectures, because:

* It dramatically eases your pain caused by the scaling / availability issues. It is terrible if your service is down AND heavy traffic from stuck users stops your status page.

* It reduces your infrastructure cost. A status page usually gets very low traffic and occasionally huge traffic. You only pay for the traffic that you handle.

## Installation

Launch your cloudformation stack by clicking the button below:

[![Launch CloudFormation Stack](https://s3.amazonaws.com/cloudformation-examples/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home#/stacks/new?stackName=StatusPage&templateURL=https://s3-ap-northeast-1.amazonaws.com/lambstatus/cf-template/0.2.0/lamb-status.yml)

When a window to create a new CloudFormation stack is opened (like below), click Next.

![CloudFormationWizard1](https://raw.githubusercontent.com/wiki/ks888/LambStatus/images/CloudFormationWizard1.png)

Then, enter your service name and initial user's info and click Next.

![CloudFormationWizard2](https://raw.githubusercontent.com/wiki/ks888/LambStatus/images/CloudFormationWizard2.png)

Click Next again.

![CloudFormationWizard3](https://raw.githubusercontent.com/wiki/ks888/LambStatus/images/CloudFormationWizard3.png)

Check the acknowledgment checkbox at the bottom and click Create.

![CloudFormationWizard4](https://raw.githubusercontent.com/wiki/ks888/LambStatus/images/CloudFormationWizard4.png)

When the stack is created, the email will be sent to the email address of the initial user. It may take 20-25 minutes, mainly due to the settings of CloudFront Distribution.

![CloudFormationWizard5](https://raw.githubusercontent.com/wiki/ks888/LambStatus/images/CloudFormationWizard5.png)

Click the link in the email, and sign in to admin console.

![CloudFormationWizard6](https://raw.githubusercontent.com/wiki/ks888/LambStatus/images/CloudFormationWizard6.png)

See [the demo page](https://lambstatus.github.io/demo-admin/) for the usage example of admin console.

## TODO

* Service status
  * [x] Show status by functional components
  * [ ] Grouping functional components ([#10](https://github.com/ks888/LambStatus/issues/10))
* Incidents
  * [x] Show incidents
  * [ ] Scheduled maintenance
* Metrics
  * [x] Show metrics
  * Import metrics data from other monitoring SaaS
    * [x] CloudWatch
    * [ ] New Relic
    * [ ] Datadog
    * [ ] ...
* Notifications
  * [ ] Email
  * [ ] Twitter
  * [ ] ...

*Note: LambStatus is still under development, and not ready for production use. Opening an issue for feature request / bug report is welcome!*

## Development

Here is the rough architecture:

![Architecture](https://raw.githubusercontent.com/wiki/ks888/LambStatus/images/Architecture.png)

To build and deploy them, follow these steps:

1. Clone the repository

  `git clone https://github.com/ks888/LambStatus`

2. Install all dependencies

  `npm run install`

3. Set configuration values at the `.env` file, just like you do on the launch of CloudFormation stack.

4. Launch cloudFormation stack

  `npm run cloudformation:create`

  Wait until the stack is created.

5. Build

  `npm run lambda:build && npm run frontend:build`

  `npm run lambda:build` builds the lambda functions and `npm run frontend:build` builds the frontend which will be uploaded to S3 bucket.

5. Deploy

  `npm run deploy`

Now, the email will be sent to the email address you specified. Click the link in the email, and sign in to admin console.
