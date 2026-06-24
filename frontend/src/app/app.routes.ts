import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../app/pages/home/home.component';
import { PressComponent } from '../app/pages/press/press.component';
import { AboutUsComponent } from '../app/pages/about-us/about-us.component';
import { AdminPanelComponent } from '../app/pages/admin-panel/admin-panel';
import { AboutUsPanelComponent } from '../app/pages/admin-panel/about-us-panel/about-us-panel.component';
import { HomePanelComponent } from '../app/pages/admin-panel/home-panel/home-panel.component';
import { OurVoice } from '../app/pages/our-voice/our-voice';
import { OurVoicePanel } from '../app/pages/admin-panel/our-voice-panel/our-voice-panel';
import { FeaturedShowsPanel } from '../app/pages/admin-panel/featured-shows-panel/featured-shows-panel';

import { Contact } from '../app/pages/contact/contact';
import { OurImpact } from '../app/pages/our-impact/our-impact';
import { OurTeam } from '../app/pages/our-team/our-team';
import {BlogComponent} from '../app/pages/blog/blog'
import {BlogIndividual} from '../app/pages/blog/blog-individual/blog-individual'
import {Brands} from '../app/pages/brands/brands'
import {Creators} from './pages/creators/creators'
import {Restaurantes} from './pages/restaurantes/restaurantes'
import {Cities} from './pages/cities/cities'

export const routes: Routes = [

      { path: '', component: HomeComponent },
      { path: 'press-release', component: PressComponent },
      { path: 'about-us', component: AboutUsComponent },
/*
      { path: 'admin-panel', component: AdminPanelComponent },
      { path: 'about-us-panel', component: AboutUsPanelComponent },
      { path: 'home-panel', component: HomePanelComponent },
      { path: 'our-voice-panel', component: OurVoicePanel },
*/
      { path: 'our-voice', component: OurVoice },

      
      { path: 'our-team', component: OurTeam },
      { path: 'featured-shows', component: FeaturedShowsPanel },
      { path: 'brands', component: Brands },
      { path: 'creators', component: Creators },
      { path: 'restaurantes/:ciudad', component: Restaurantes },
      { path: 'cities', component: Cities },




      

      { path: 'our-impact', component: OurImpact },
      { path: 'contact', component: Contact },
      { path: 'blogs', component: BlogComponent },
     { path: 'blog/:slug', component: BlogIndividual },


      
];
