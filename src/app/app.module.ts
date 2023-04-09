import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Web3Service } from './services/web3.service';
import { CampaignComponent } from './components/campaign/campaign.component';
import { HeaderComponent } from './components/header/header.component';
import { RequestsComponent } from './components/requests/requests.component';
import { RequestNewComponent } from './components/request-new/request-new.component';
import { CampaignNewComponent } from './components/campaign-new/campaign-new.component';
import { CampaignsComponent } from './components/campaigns/campaigns.component';

import { TabMenuModule } from 'primeng/tabmenu';

@NgModule({
  declarations: [
    AppComponent,
    CampaignComponent,
    HeaderComponent,
    RequestsComponent,
    RequestNewComponent,
    CampaignNewComponent,
    CampaignsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    TabMenuModule
  ],
  providers: [
    Web3Service
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
