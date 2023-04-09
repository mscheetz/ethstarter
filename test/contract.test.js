const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    
    factory = await new web3.eth.Contract(compiledFactory.abi)
        .deploy({
            data: compiledFactory.evm.bytecode.object
        })
        .send({
            from: accounts[0],
            gas: '1400000'
        });

    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '1000000'
    });

    // gets first element from array and sets to variable
    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

    campaign = await new web3.eth.Contract(
        compiledCampaign.abi, 
        campaignAddress
    );
});

describe('Campaigns', () => {
    it('deploys a factory and a campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('marks caller as the campaign manager', async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], manager);
    });

    it('allows people to contribute eth and mark them as approver', async () => {
        const accountToTest = accounts[1];
        await campaign.methods.contribute().send({
            value: '200',
            from: accountToTest
        });
        const isApprover = await campaign.methods.approvers(accountToTest).call();
        assert.equal(true, isApprover);
    });

    it('require minimum contribution', async () => {
        const accountToTest = accounts[1];
        try {
            await campaign.methods.contribute().send({
                value: '99',
                from: accountToTest
            });

            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('manager can create payment request', async () => {
        await campaign.methods
            .createRequest('Buy batteries', '100', accounts[1])
            .send({
                gas: '1000000',
                from: accounts[0]
            });

        const request = await campaign.methods.requests(0).call();

        assert.equal('Buy batteries', request.description);
    });

    it('non-manager cannot create payment request', async () => {
        try {
            await campaign.methods
                .createRequest('Buy batteries', '100', accounts[2])
                .send({
                    gas: '1000000',
                    from: accounts[1]
                });
            assert(false);
        } catch (err){
            assert(err);
        }
    });

    it('process requests', async () => {
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        });

        let beginningBalance = await web3.eth.getBalance(accounts[1]);
        beginningBalance = web3.utils.fromWei(beginningBalance, 'ether');
        beginningBalance = parseFloat(beginningBalance);

        await campaign.methods
            .createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1])
            .send( {
                from: accounts[0],
                gas: '1000000'
            });

        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        let balance = await web3.eth.getBalance(accounts[1]);
        balance = web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);

        assert(balance > beginningBalance);
    });

    it('request must be approved to process', async () => {
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        });

        let beginningBalance = await web3.eth.getBalance(accounts[1]);
        beginningBalance = web3.utils.fromWei(beginningBalance, 'ether');
        beginningBalance = parseFloat(beginningBalance);

        await campaign.methods
            .createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1])
            .send( {
                from: accounts[0],
                gas: '1000000'
            });

        try {
            await campaign.methods.finalizeRequest(0).send({
                from: accounts[0],
                gas: '1000000'
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('non-manager cannot process requests', async () => {
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        });

        let beginningBalance = await web3.eth.getBalance(accounts[1]);
        beginningBalance = web3.utils.fromWei(beginningBalance, 'ether');
        beginningBalance = parseFloat(beginningBalance);

        await campaign.methods
            .createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1])
            .send( {
                from: accounts[0],
                gas: '1000000'
            });

        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        try {
            await campaign.methods.finalizeRequest(0).send({
                from: accounts[0],
                gas: '1000000'
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });
});
