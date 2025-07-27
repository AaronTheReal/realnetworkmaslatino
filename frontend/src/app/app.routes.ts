import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../app/pages/home/home.component';
import { PressComponent } from '../app/pages/press/press.component';
import { AboutUsComponent } from '../app/pages/about-us/about-us.component';
import { AdminPanelComponent } from '../app/pages/admin-panel/admin-panel';
import { AboutUsPanelComponent } from '../app/pages/admin-panel/about-us-panel/about-us-panel.component';
import { HomePanelComponent } from '../app/pages/admin-panel/home-panel/home-panel.component';
import { OurVoice } from '../app/pages/our-voice/our-voice';
import { Contact } from '../app/pages/contact/contact';

export const routes: Routes = [

      { path: '', component: HomeComponent },
      { path: 'press-release', component: PressComponent },
      { path: 'about-us', component: AboutUsComponent },
      { path: 'admin-panel', component: AdminPanelComponent },
      { path: 'about-us-panel', component: AboutUsPanelComponent },
      { path: 'home-panel', component: HomePanelComponent },
      { path: 'our-voice', component: OurVoice },
      { path: 'contact', component: Contact },

];
