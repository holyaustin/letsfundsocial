require('@nomicfoundation/hardhat-toolbox')
require('dotenv').config()

module.exports = {
  defaultNetwork: 'aiaTestnet',
  networks: {
    hardhat: {},
    localhost: {
      url: 'http://127.0.0.1:8545',
    },
    aiaTestnet: {
      url: 'https://aia-dataseed1-testnet.aiachain.org',
      accounts: [process.env.NEXT_PUBLIC_PRIVATE_KEY],
      chainId: 1320,
    },
    aiaMainnet: {
      url: 'https://aia-dataseed3.aiachain.org',
      accounts: [process.env.NEXT_PUBLIC_PRIVATE_KEY],
      chainId: 1319,
    },
  },
  solidity: {
    version: '0.8.17',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  mocha: {
    timeout: 40000,
  },
}
