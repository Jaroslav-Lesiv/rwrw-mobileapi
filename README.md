
# RWRD

  

## Project core dependencies

  

### Tools

  

-  [Node.js](https://nodejs.org/en/) (recommended version is **10.15.3**)

-  [Yarn](https://yarnpkg.com/en/docs/install) (recommended version is **1.15.2**)

  

## Code style requirements

  

The code follows the standard [ECMAScript 2017](https://medium.freecodecamp.org/here-are-examples-of-everything-new-in-ecmascript-2016-2017-and-2018-d52fa3b5a70e).

  

[ESLint](https://eslint.org/) is configured with rules (file `.eslint.js`) to catch most problems with code style, so make sure ESLint is installed globally (`npm i -g eslint`) on your machine and configured to work with your IDE, in this way you should see blocks of code highlighted if something is wrong with it.

  

## How to run the app

### Build client app

Build client app

  

Create a symlink for a client/build folder

  

Put symlink to to the root server folder and rename it to `public`
  

### Modify project env

  

copy .env.example

rename to .env

modify .env and set 3-th party services credentionals

### Install node dependencies

  

*Run inside the project's folder*

  

```

yarn install

```

  

### Import default database collections

run `yarn database:imports`

  

### Stripe configuration

Create `stripe` plans and then modify `subscriptions_id` (and prices if needed) in ./database/collections/subscriptions.js

  



### Run the dev server

```

yarn start

```

  

### Run the prod server

  
  

**NOTE:** modify .env and set NODE_ENV=production

  

```

yarn server

```

  

## Steps for run the app

- [RWRD](#rwrd)
  - [Project core dependencies](#project-core-dependencies)
    - [Tools](#tools)
  - [Code style requirements](#code-style-requirements)
  - [How to run the app](#how-to-run-the-app)
    - [Build client app](#build-client-app)
    - [Modify project env](#modify-project-env)
    - [Install node dependencies](#install-node-dependencies)
    - [Import default database collections](#import-default-database-collections)
    - [Stripe configuration](#stripe-configuration)
    - [Run the dev server](#run-the-dev-server)
    - [Run the prod server](#run-the-prod-server)
  - [Steps for run the app](#steps-for-run-the-app)
