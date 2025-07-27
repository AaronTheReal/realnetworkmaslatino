import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../app/pages/home/home.component';
import { PressComponent } from '../app/pages/press/press.component';
import { AboutUsComponent } from '../app/pages/about-us/about-us.component';
import { AdminPanelComponent } from '../app/pages/admin-panel/admin-panel';

export const routes: Routes = [

      { path: '', component: HomeComponent },
      { path: 'press-release', component: PressComponent },
      { path: 'about-us', component: AboutUsComponent },
      { path: 'admin-panel', component: AdminPanelComponent },

];
