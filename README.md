# legacy-solcast

## Getting Started

### Prerequisites



- Node v18.18.0 or higher
- Solidity Compiler (solc) v0.8.0 or higher
- Hardhat v2.8.0 or higher

### Installation

#### Clone the repo

```shell
git clone <repo-url>
cd <repo-name>
```

#### Install Dependencies

```shell
pnpm install
```

### Install Hardhat globaly

   ```shell
    npm install -g hardhat
 ```
### Navigate to the Solidity project directory and install dependencies:

    ```shell
    cd solidity
    npm install
    ```
#### Compile the Contracts

To compile the Solidity contracts, run:

```shell
npx hardhat compile
```

#### Start the web app

```
pnpm dev
```

## Apps

### Solidity
This project includes a Solidity component for smart contract development. Below are the steps to get started with Solidity development.

### Hardhat

Hardhat is a development environment to compile, deploy, test, and debug your Ethereum software. It helps developers manage and automate the recurring tasks inherent to the process of building smart contracts and dApps.


### web

This is a Next.js app that uses the generated client to interact with the Ethereum smart contracts deployed using Hardhat.

#### Commands

Start the web app

```shell
pnpm dev
```

Build the web app

```shell
pnpm build
```
