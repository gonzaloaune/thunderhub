# **ThunderHub - Lightning Node Manager**

![Home Screenshot](/docs/Home.png)
[![license](https://img.shields.io/github/license/DAVFoundation/captain-n3m0.svg?style=flat-square)](https://github.com/DAVFoundation/captain-n3m0/blob/master/LICENSE)

## Table Of Contents

- [Introduction](#introduction)
- [Integrations](#integrations)
- [Features](#features)
- [Installation](#installation)
- [Development](#development)
- [Docker deployment](#docker)

## Introduction

ThunderHub is an **open-source** LND node manager where you can manage and monitor your node on any device or browser. It allows you to take control of the lightning network with a simple and intuitive UX and the most up-to-date tech stack.

### Integrations

**BTCPay Server**
ThunderHub is currently integrated into BTCPay for easier deployment. If you already have a BTCPay server and want to add ThunderHub or even want to start a BTCPay server from zero, be sure to check out this [tutorial](https://apotdevin.com/blog/thunderhub-btcpay)

**Raspiblitz**
For Raspiblitz users you can also get ThunderHub running by following this [gist](https://gist.github.com/openoms/8ba963915c786ce01892f2c9fa2707bc)

### Tech Stack

This repository consists of a **NextJS** server that handles both the backend **Graphql Server** and the frontend **React App**. ThunderHub connects to your Lightning Network node by using the gRPC ports.

- NextJS
- ReactJS
- Typescript
- Styled-Components
- Apollo
- Apollo-Server
- GraphQL
- Ln-Service

## Features

### Monitoring

- Overview of current and pending balance for the Lightning and Bitcoin wallets.
- URI strings for the node (Onion public uri also if available)
- Invoice and Payment graph.
- Liquidity report with total remote and local lightning balance.
- Forwarded payments graph and the routes used for these payments.
- Complete network info.
- View open/pending/closed channels and how balanced they are.
- View channel base and rate fees.
- View all transactions.
- View all forwarded payments.
- View all chain transactions.
- View all unspent UTXOS.

### Management

- Send and Receive Lightning payments.
- Send and Receive Bitcoin payments.
- Decode lightning payment requests.
- Open and close channels.
- Balance your channels through circular payments. ([Check out the Tutorial](https://apotdevin.com/blog/thunderhub-balancing))
- Update your all your channels fees or individual ones.
- Backup, verify and recover all your channels.
- Sign and verify messages.

### Visual

- Responsive UI for any device. Mobile, Tablet or Desktop.
- Light and Dark mode.
- Check values in Bitcoin, Satoshis or Fiat.

### Accounts

- Many ways to connect to your node: **HEX/Base64 strings**, **LNDConnect Url**, **BTCPayServer Info** or **QR codes**.
- Have view-only and/or admin accounts.
- Manage however many accounts your browser storage can hold.
- Quickly sync your accounts between devices. No need to copy/paste macaroons and certificates.

### Deployment

- Docker images for easier deployment

### Future Features

- Channel health/recommendations view
- Loop In and Out to provide liquidity or remove it from your channels.
- Storefront interface

## **Requirements**

- Yarn/npm installed
- Node installed (Version 12.16.0 or higher)

**Older Versions of Node**
Earlier versions of Node can be used if you replace the following commands:

```js
//Yarn
yarn start -> yarn start:compatible
yarn dev -> yarn dev:compatible

//NPM
npm start -> npm start:compatible
npm run dev -> npm run dev:compatible
```

**HodlHodl integration will not work with older versions of Node!**

## Config

You can define some environment variables that ThunderHub can start with. To do this create a `.env` file in the root directory with the following parameters:

```js
LOG_LEVEL = 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly' //Default: 'info'
THEME = 'dark' | 'light'; // Default: 'dark'
CURRENCY = 'sat' | 'btc' | 'eur' | 'usd'; // Default: 'sat'
FETCH_PRICES = true | false // Default: true
FETCH_FEES = true | false // Default: true
HODL_KEY = '[Key provided by HodlHodl]' //Default: ''
BASE_PATH = '[Base path where you want to have thunderhub running i.e. '/btcpay']' //Default: '/'
```

### SSO Account

You can define an account to work with SSO cookie authentication by adding the following parameters in the `.env` file:

```js
COOKIE_PATH = '/path/to/cookie/file/.cookie'; // i.e. '/data/.cookie'
SSO_SERVER_URL = 'url and port to node'; // i.e. '127.0.0.1:10009'
SSO_CERT_PATH = '/path/to/tls/certificate'; // i.e. '\lnd\alice\tls.cert'
SSO_MACAROON_PATH = '/path/to/macaroon/folder'; //i.e. '\lnd\alice\data\chain\bitcoin\regtest\'
```

To login to this account you must add the cookie file content to the end of your ThunderHub url. For example:

```
http://localhost:3000?token=[COOKIE]
```

Replace `[COOKIE]` with the contents of the `.cookie` file.

### Server Accounts

You can add accounts on the server by adding this parameter to the `.env` file:

```js
ACCOUNT_CONFIG_PATH = '/path/to/config/file.yaml'; // i.e. '/data/thubConfig.yaml'
```

You must also add a YAML file at that location with the following format:

```yaml
masterPassword: 'password' # Default password unless defined in account
accounts:
  - name: 'Account 1'
    serverUrl: 'url:port'
    macaroonPath: '/path/to/admin.macaroon'
    certificatePath: '/path/to/tls.cert'
    password: 'password for account 1'
  - name: 'Account 2'
    serverUrl: 'url:port'
    macaroonPath: '/path/to/admin.macaroon'
    certificatePath: '/path/to/tls.cert'
    # password: Leave without password and it will use the master password
```

### Fetching prices and fees

ThunderHub fetches fiat prices from [Blockchain.com](https://blockchain.info/ticker)'s api and bitcoin on chain fees from [Earn.com](https://bitcoinfees.earn.com/api/v1/fees/recommended)'s api.

If you want to deactivate these requests you can set `FETCH_PRICES=false` and `FETCH_FEES=false` in your `.env` file or manually change them inside the settings view of ThunderHub.

### Running on different base path

Adding a BASE_PATH will run the ThunderHub server on a different base path.
For example:

- default base path of `/` runs ThunderHub on `http://localhost:3000`
- base path of `/thub` runs ThunderHub on `http://localhost:3000/thub`

To run on a base path, ThunderHub needs to be behind a proxy with the following configuration (NGINX example):

```nginx
location /thub/ {
  rewrite ^/thub(.*)$ $1 break;
  proxy_pass http://localhost:3000/;
}
```

## Installation

To run ThunderHub you first need to clone this repository.

```js
git clone https://github.com/apotdevin/thunderhub.git
```

After cloning the repository run `yarn` or `npm install` to get all the necessary modules installed.

After all the dependencies have finished installing, you can proceed to build and run the app with the following commands.

```javascript
//Yarn
yarn build
yarn start

//NPM
npm run build
npm start
```

This will start the server on port 3000, so just go to `localhost:3000` to see the app running.

If you want to specify a different port (for example port `4000`) run with:

```js
// Yarn
yarn start -p 4000

// NPM
npm start -- -p 4000
```

## Development

If you want to develop on ThunderHub and want hot reloading when you do changes, use the following commands:

```js
//Yarn
yarn dev

//NPM
npm run dev
```

#### Storybook

You can also get storybook running for quicker component development.

```js
//Yarn
yarn storybook

//NPM
npm run storybook
```

## Docker

ThunderHub also provides docker images for easier deployment. [Docker Hub](https://hub.docker.com/repository/docker/apotdevin/thunderhub)

To get ThunderHub running with docker follow these steps:

1. `docker pull apotdevin/thunderhub:v0.5.5` (Or the latest version you find)
2. `docker run --rm -it -p 3000:3000/tcp apotdevin/thunderhub:v0.5.5`

You can now go to `localhost:3000` to see your running instance of ThunderHub
