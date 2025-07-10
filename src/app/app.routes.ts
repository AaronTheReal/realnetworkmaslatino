import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../app/pages/home/home.component';
import { PressComponent } from '../app/pages/press/press.component';

export const routes: Routes = [

      { path: '', component: HomeComponent },
      { path: 'press-release', component: PressComponent },
];
