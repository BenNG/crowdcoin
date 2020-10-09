const HDWalletProvider = require('truffle-hdwallet-provider');

const Web3 = require('web3');

const compiledFactory = require('./build/CampaignFactory.json');

const provider = new HDWalletProvider(
  'depth pioneer pudding secret firm moon still effort innocent unaware maximum heart',
  'https://ropsten.infura.io/v3/43cc01e6a7214eeda7ed8ca7e9d027dd'
);

const web3 = new Web3(provider);

const deploy = async () => {
  let accounts;
  let deployedContract;
  try {
    accounts = await web3.eth.getAccounts();
    console.log('accounts', accounts);
  } catch (e) {
    console.log('something wrong when getting the accounts');
  }
  console.log('attempting to deploy from account', accounts[0]);
  try {
    deployedContract = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
      .deploy({ data: compiledFactory.bytecode })
      .send({ from: accounts[0], gas: '1000000' });
    console.log('contract deployed to ', deployedContract.options.address);
  } catch (e) {
    console.log('something wrong 2');
    console.log('e', e);
  }
};
deploy();
