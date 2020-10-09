const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');
const { send } = require('process');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: '1000000' });

  await factory.methods.createCampaign('100').send({
    from: accounts[0],
    gas: '1000000',
  });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

  campaign = await new web3.eth.Contract(JSON.parse(compiledCampaign.interface), campaignAddress);
});

describe('Campaigns', () => {
  it('deploys a factory and a campaign', () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it('should mark the caller to be the manager of the campaign', async () => {
    const manager = await campaign.methods.manager().call();
    assert.strictEqual(manager, accounts[0]);
  });

  it('should let people contribute and mark them as approvers if the they provide the minimum contribution', async () => {
    await campaign.methods.contribute().send({ from: accounts[1], value: web3.utils.toWei('0.5', 'ether') });
    const flag = await campaign.methods.approvers(accounts[1]).call();
    assert.ok(flag);
  });

  it('should NOT let people contribute to the campaign if the they NOT provide the minimum contribution', async () => {
    try {
      await campaign.methods.contribute().send({ from: accounts[1], value: '99' });
      assert(false);
    } catch (e) {
      assert(true);
    }
  });

  it('should let a manager create a payment request', async () => {
    await campaign.methods
      .createRequest('buy batteries', web3.utils.toWei('0.6', 'ether'), accounts[2])
      .send({ from: accounts[0], gas: '1000000' });
    const request = await campaign.methods.requests(0).call();
    assert.strictEqual(request.description, 'buy batteries');
  });

  it('processes requests', async () => {
    await campaign.methods.contribute().send({ from: accounts[1], value: web3.utils.toWei('0.5', 'ether') });
    await campaign.methods
      .createRequest('buy batteries', web3.utils.toWei('0.3', 'ether'), accounts[2])
      .send({ from: accounts[0], gas: '1000000' });
    const balance2 = await web3.eth.getBalance(accounts[2]);
    await campaign.methods.approveRequest(0).send({ from: accounts[1], gas: '1000000' });
    await campaign.methods.finalizeRequest(0).send({ from: accounts[0], gas: '1000000' });
    const balance2Final = await web3.eth.getBalance(accounts[2]);
    assert(balance2Final > balance2);
  });
});
