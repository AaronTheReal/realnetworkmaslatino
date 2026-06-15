import { Component } from '@angular/core';
import {WhatTheyGet} from './what-they-get/what-they-get'
import {FormCreator} from './form-creator/form-creator'

@Component({
  selector: 'app-creators',
  imports: [WhatTheyGet,FormCreator],
  templateUrl: './creators.html',
  styleUrl: './creators.css'
})
export class Creators {

}
