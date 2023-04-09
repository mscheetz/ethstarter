import { Injectable } from "@angular/core";
import { Web3Service } from "./web3.service";

@Injectable()
export class CampaignFactoryContract {
    public address: string = '';
    private abi: any = [];

    public contract: any;

    constructor(private web3Svc: Web3Service) {
        this.contract = new web3Svc.web3.eth.Contract(this.abi, this.address);
    }
}