// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.9;

contract CampaignFactory {
    address payable[] public deployedCampaigns;

    function createCampaign(uint minimumContribution) public {        
        address newCampaign = address(new Campaign(msg.sender, minimumContribution));
        deployedCampaigns.push(payable(newCampaign));
    }

    function getDeployedCampaigns() public view returns(address payable[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    mapping(uint => Request) public requests;
    uint private currentIndex;

    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;

    constructor(address creator, uint minimum) {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value >= minimumContribution);

        approvers[payable(msg.sender)] = true;
        approversCount++;
    }

    function createRequest(string memory description, uint value, address payable recipient)
        payable public restricted 
    {
        Request storage newRequest = requests[currentIndex];
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;

        currentIndex++;
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];

        require(approvers[msg.sender]);
        require(!request.approvals[payable(msg.sender)]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public restricted {
        require(index <= currentIndex);

        Request storage request = requests[index];

        require(request.approvalCount > (approversCount / 2));
        require(!request.complete);

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function requestCount() public view returns(uint) { 
        return currentIndex;
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
}