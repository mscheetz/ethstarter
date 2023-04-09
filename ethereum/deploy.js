const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json');
const { mnemonic, infuraKey } = require('../config');

/**
 * Run from project root: 
 * $ node ethereum/deploy.js 
 */

const provider = new HDWalletProvider(
    `${mnemonic}`,
    `https://goerli.infura.io/v3/${infuraKey}`
);

const web3 = new Web3(provider);

const deploy = async() => {
    const accounts = await web3.eth.getAccounts();
    
    console.log('Attempting to deploy from account', accounts[0]);

    try {
        const result = await new web3.eth.Contract(compiledFactory.abi)
            .deploy({
                data: compiledFactory.evm.bytecode.object
            })
            .send({
                gas: '1400000',
                from: accounts[0]
            });

        console.log('Contract deployed to', result.options.address);
    } catch(err) {
        console.log(err);
    }

    provider.engine.stop();
};

deploy();