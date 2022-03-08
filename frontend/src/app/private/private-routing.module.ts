import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateChannelComponent } from './components/create-channel/create-channel.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SettingComponent } from './components/setting/setting.component';
import { LogoutComponent } from './components/logout/logout.component';
import { MatchComponent } from './components/match/match.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FriendComponent } from './components/friend/friend.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { TwoFactorComponent } from './components/two-factor/two-factor.component';
import { TwoFactorDisabledComponent } from './components/two-factor-disabled/two-factor-disabled.component';
import { ProfileusersComponent } from './components/profile-users/profile-users.component';
import { AllChannelsComponent } from './components/all-channels/all-channels.component';
import { AdministrationComponent } from './components/administration/administration.component';
import { OptionChannelComponent } from './components/option-channel/option-channel.component';

const routes: Routes = [
  {path: 'dashboard', component: DashboardComponent},
  {path: 'create-channel', component: CreateChannelComponent},
  {path: 'all-channels', component: AllChannelsComponent},
  {path: 'setting', component: SettingComponent},
  {path: 'logout', component: LogoutComponent},
  {path: 'match', component: MatchComponent},
  {path: 'profile',
    children: [
      {path: '', component: ProfileComponent},
      {path: ':id', component: ProfileusersComponent},
    ]
  },
  {path: 'option-channel/:id', component: OptionChannelComponent},
  {path: 'friend', component: FriendComponent},
  {path: 'admin', component: AdministrationComponent},
  {path: 'two-factor', component: TwoFactorComponent},
  {path: 'two-factor-disabled', component: TwoFactorDisabledComponent},
  {path: 'page-not-found', component: PageNotFoundComponent},
  {path: '**', component: PageNotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivateRoutingModule { }
