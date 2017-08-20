# Contributing to LambStatus

Thank you for seeing this page! The page will show you how to set up the developing environment so that you can start fixing a bug or adding a new feature.

### Architecture

Here is the rough architecture:

![Architecture](https://raw.githubusercontent.com/wiki/ks888/LambStatus/images/Architecture.png)

### Set up

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

