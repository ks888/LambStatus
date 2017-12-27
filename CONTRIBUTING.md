# Contributing to LambStatus

Thank you for seeing this page! The page has the resources to start working on the LambStatus yourself.

* [Coding rules](#coding-rules)
* [Project structure](#project-structure)
* [How to set up the development environment](#set-up-the-development-environment)
* [Good First Issues](#good-first-issues)

## Coding Rules

* Follow [JavaScript Standard Style](https://standardjs.com/).
* Write tests.

## Project Structure

Here is the rough system architecture:

![Architecture](https://raw.githubusercontent.com/wiki/ks888/LambStatus/images/Architecture.png)

These 3 directories under the repository are especially important for this system:

* `./cloudformation`: the CloudFormation template. It describes all the AWS resources including Lambda, API Gateway, DynamoDB, etc.
* `./packages/lambda`: Server-side code. All the server-side code runs as the Lambda Functions.
* `./packages/frontend`: Client-side code. These are deployed to the S3 and served via CloudFront.

Here is the contents of each directory:

```
.
├── cloudformation
|   ├── bin                    --- the scripts to create the CloudFormation stack
|   └── lamb-status.yml        --- the CloudFormation template file
└── packages
    ├── lambda
    |   ├── bin                --- the scripts to build and deploy the lambda functions
    |   ├── config             --- the webpack config file to build the codes
    |   ├── src
    |   |   ├── api            --- the entrypoints of Lambda functions. Handles the event from the API Gateway
    |   |   ├── aws            --- the classes to access AWS resources
    |   |   ├── db             --- the classes to access the database
    |   |   ├── model          --- the models
    |   |   └── utils          --- the utilities
    |   ├── test               --- tests. Same structure as ./src
    |   └── package.json       --- package.json file for lambda functions
    └── frontend
        ├── bin                --- the scripts to build and deploy the frontend
        ├── build              --- the webpack config file to build the codes
        ├── config             --- the environment-dependent config files
        ├── src
        |   ├── actions        --- Redux actions
        |   ├── components     --- React components
        |   ├── reducers       --- Redux reducers
        |   ├── utils          --- the utilities
        |   ├── admin-page.js  --- the entrypoint of the admin page
        |   └── status-page.js --- the entrypoint of the status page
        ├── test               --- tests. Same structure as ./src
        └── package.json       --- package.json file for frontend
```

## Set up the Development Environment

### Prerequisite Software

* Node.js (v4.3.2)

### Initial set up

1. Clone the repository and go to the cloned directory

   `git clone https://github.com/ks888/LambStatus && cd LambStatus`

2. Install all dependencies

   `npm run install`

3. Configure the `.env` file. At least, you need to write your email address to the `USER_EMAIL` line because the initial login information will be sent to the address.

4. Launch CloudFormation stack

   `npm run cloudformation:create`

   If the command returns an error, make sure you properly configured [the AWS credentials](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html#cli-quick-configuration).

   When the stack is created, the email will be sent to the email address.

### To change AWS resources CloudFormation creates

1. Make your change.

2. Update the CloudFormation stack

   `npm run cloudformation:update`

### To change server-side code

1. Go to the `lambda` directory

   `cd packages/lambda`

2. Make sure the tests pass

   `npm run test`

3. Make your change. Add tests for your change. Make the tests pass

4. (If necessary, deploy your functions)

   `npm run deploy`

   Note: LambStatus depends on [apex](http://apex.run/) to deploy lambda functions. [Please install it](http://apex.run/#installation) if `apex` command is not found.

### To change client-side code

1. Go to the `frontend` directory

   `cd packages/frontend`

2. Make sure the tests pass

   `npm run test`

3. Make your change. Add tests for your change. Make the tests pass

4. (If necessary, run the local server)

   `npm run start         # Run the local server for the admin page. Visit http://localhost:3000`

   `npm run start:status  # Run the local server for the status page. Visit http://localhost:3001`

## Good First Issues

Good issues for first-time contributors have the label [*good first issue*](https://github.com/ks888/LambStatus/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22). 
