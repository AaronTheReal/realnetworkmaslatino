import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../app/pages/home/home.component';
import { PressComponent } from '../app/pages/press/press.component';
import { AboutUsComponent } from '../app/pages/about-us/about-us.component';
import { ContactComponent } from '../app/pages/contact/contact.component';
import { OurVoiceComponent } from './pages/our-voice/our-voice.component';
import { OurImpactComponent } from './pages/our-impact/our-impact.component';


export const routes: Routes = [

      { path: '', component: HomeComponent },
      { path: 'press-release', component: PressComponent },
      { path: 'about-us', component: AboutUsComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'our-voice', component: OurVoiceComponent },
      { path: 'our-impact', component: OurImpactComponent },


];
