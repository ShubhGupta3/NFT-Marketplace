require("@nomiclabs/hardhat-waffle");
require('dotenv').config()

const infuraId = process.env.REACT_APP_INFURA_ID
const privateKey1 = process.env.REACT_APP_PRIVATE_KEY1

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${infuraId}`,
      accounts: [privateKey1]
    }
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};

