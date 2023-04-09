import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../../services/web3.service';

@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.scss']
})
export class CampaignsComponent implements OnInit {
  public contracts: string[] = [];

  constructor(private web3: Web3Service) {}

  ngOnInit(): void {
    
  }
}
