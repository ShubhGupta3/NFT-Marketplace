# Basic NFT Marketplace

## About Project

This project uses Solidity language to create Ethereum Smart Contracts
Hardhat to interact with the contracts
OpenZeppelin to import useful Contracts
Reactjs and React Bootstrap for Front-end stuff

[Link to working demo of project](https://drive.google.com/file/d/1hfQDO2RUzCHkjAGAzvdk1TZGRYu_jXRF/view?usp=sharing)

## Working with the repo on your system

Clone the repo into your code editor and run

```shell
npm install
```

This will install all the dependencies required for project to function.
Then initialize hardhat and compile to create artifacts

```shell
npx hardhat
npx hardhat compile
```

Once the contract gets compiled, go ahead and copy the NFT ABI from artifacts/contracts/NFT.sol/NFT.json into src/abi/NFTabi.js and default export it.
Do the same for NFTMarket contract as well

To deploy contracts on Rinkeby Testnet, run

```shell
npx hardhat run scripts/deploy.js --network rinkeby
```

Then update the respective contract addresses in config.js and you're ready to launch the marketplace!

Enter into the NFT Marketplace using:

```shell
npm start
```
