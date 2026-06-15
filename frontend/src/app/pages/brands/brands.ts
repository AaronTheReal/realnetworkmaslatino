import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import {Activations} from './activations/activations'

@Component({
  selector: 'app-brands',
  imports: [Activations, NgOptimizedImage],
  templateUrl: './brands.html',
  styleUrl: './brands.css'
})
export class Brands {

}
