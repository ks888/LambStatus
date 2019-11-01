# LambStatus

[![Launch CloudFormation Stack](https://s3.amazonaws.com/cloudformation-examples/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home#/stacks/new?stackName=StatusPage&templateURL=https://s3-ap-northeast-1.amazonaws.com/lambstatus/cf-template/0.6.6/lamb-status.yml)
[![wercker status](https://app.wercker.com/status/fcb6fb7398629e934ae0538737021d14/s/master "wercker status")](https://app.wercker.com/project/byKey/fcb6fb7398629e934ae0538737021d14)
[![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/ks888/LambStatus)
[![API Document](https://img.shields.io/badge/api-v0-blue.svg)](https://lambstatus.github.io/apidocs/)

LambStatus is the serverless status page system. [See our website](https://lambstatus.github.io/) for features.

## Demo

* [Status page](https://demo-status.lambstatus.org): the page to tell your service's status to your users
* [Admin page](https://demo-admin.lambstatus.org): the page to change your service's status

## Get Started

See [the getting started page](https://lambstatus.github.io/get-started) to build your first status page with just a few clicks!

## Goals of this project

* Offers an open source and serverless status page system.
* Offers a pay-as-you-go pricing approach like AWS. We estimate the system takes just *$1 to handle 30,000 visitors* ([see details](https://lambstatus.github.io/cost-estimate)).
* Enables you to build and maintain the status page system with minimum effort.

## Why Serverless?

Status page system is great with the Serverless architecture, because:

* It eases your pain caused by the scaling / availability issues. It is terrible if your service is down AND heavy traffic from stuck users stops your status page.
* It enables you to pay only for what you use. A status page only occasionally gets huge traffic. The system takes only $1 per 30,000 visitors and almost $0 if no visitors.

## Join our Community

* Follow [our twitter account](https://twitter.com/LambStatus) to get the latest news.
* Ask a question at the [Gitter Chatroom](https://gitter.im/ks888/LambStatus) or [GitHub Issues](https://github.com/ks888/LambStatus/issues/new).
* Report a bug, a feature request, a design issue and even typo at [GitHub Issues](https://github.com/ks888/LambStatus/issues/new).
* Open a first pull request reading our [contributing document](https://lambstatus.github.io/contributing)!
