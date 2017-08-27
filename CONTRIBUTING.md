# Contributing to LambStatus

Thank you for seeing this page! The page has the resources to start working on the LambStatus yourself.

Table of Contents:

* Coding rules
* Project structure
* How to set up the local environment

## Coding Rules

* Follow [JavaScript Standard Style](https://standardjs.com/).
* Write tests.

## Project Structure

Here is the rough system architecture:

![Architecture](https://raw.githubusercontent.com/wiki/ks888/LambStatus/images/Architecture.png)

These 3 directories under the repository are especially important to build the system:

* `./cloudformation`: the CloudFormation template. It describes all the AWS resources including Lambda, API Gateway, DynamoDB, etc.
* `./packages/lambda`: Server-side codes. All the server-side codes runs as the Lambda Functions.
* `./packages/frontend`: Client-side codes. These codes are deployed to the S3 and served via CloudFront.

Here is the description of each directory:

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
    |   |   ├── api            --- the handlers for the event from the API Gateway
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
        |   ├── admin-page.js  --- the js file to bootstrap the admin page
        |   └── status-page.js --- the js file to bootstrap the status page
        ├── test               --- tests. Same structure as ./src
        └── package.json       --- package.json file for frontend
```

## Set up the Local Environment

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

   The command will return immediately, but it may take 20-25 minutes to actually create the stack, mainly due to the settings of CloudFront Distribution.

   If the command returns an error, make sure you properly configured [the AWS credentials](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html#config-settings-and-precedence).

### Server-side development

1. Go to the `lambda` directory

   `cd packages/lambda`

2. Build

   `npm run build`

3. Test

   `npm run test`

4. Deploy

   `npm run deploy`

### Client-side development

1. Go to the `frontend` directory

   `cd packages/frontend`

2. Build

   `npm run build`

3. Test

   `npm run test`

4. Run the local server

   `npm run start`

Now, visit http://localhost:3000 and sign in to the admin console. Get the login information from the email you received.

