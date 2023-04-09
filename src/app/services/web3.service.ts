import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import Web3 from "web3";
declare var window: any;

@Injectable()
export class Web3Service {
    public web3: Web3 = new Web3();
    public accounts: string[] = [];
    private connectedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public connected: Observable<boolean> = this.connectedSubject.asObservable();
    private newAddressSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public newAddress: Observable<boolean> = this.newAddressSubject.asObservable();
    private newChainSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public newChain: Observable<boolean> = this.newChainSubject.asObservable();

    constructor() {
        this.metamaskConnect();

        window.ethereum.on('accountsChanged', async (accounts: any[]) => {
          this.newAddressSubject.next(true);
        });
    
        window.ethereum.on('networkChanged', async (accounts: any[]) => {
            this.newChainSubject.next(true);
        });
    }

    private async metamaskConnect() {
        if (typeof window.ethereum !== 'undefined') {
            this.web3 = new Web3(window.ethereum);
    
            await window.ethereum.enable();
    
            await this.setAccounts();
            this.connectedSubject.next(true);
        }
    }

    public async setAccounts() {
        this.accounts = await this.web3.eth.requestAccounts();
    }

    public async getBalance(address: string = '', inEth: boolean = false): Promise<string> {
        if (address === '' && this.accounts.length > 0) {
            address = this.accounts[0];
        }

        const balance = await this.web3.eth.getBalance(address);

        if (inEth) {
            return this.web3.utils.fromWei(balance);
        } else {
            return balance;
        }
    }

    public async getNetwork(): Promise<any[]> {
        const networkId = await this.web3.eth.net.getId();
        const networkName = await this.web3.eth.net.getNetworkType();

        return [ networkId, networkName ];
    }
}