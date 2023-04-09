import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CampaignComponent } from './components/campaign/campaign.component';
import { CampaignNewComponent } from './components/campaign-new/campaign-new.component';
import { CampaignsComponent } from './components/campaigns/campaigns.component';

const routes: Routes = [
  { path: '', component: CampaignsComponent },
  { path: 'campaign/new', component: CampaignNewComponent },
  { path: 'campaign/{contract}', component: CampaignComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
