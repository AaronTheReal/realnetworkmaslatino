import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import {WhatTheyGet} from './what-they-get/what-they-get'
import {FormCreator} from './form-creator/form-creator'

@Component({
  selector: 'app-creators',
  imports: [WhatTheyGet, FormCreator, NgOptimizedImage],
  templateUrl: './creators.html',
  styleUrl: './creators.css'
})
export class Creators {

}
