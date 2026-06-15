import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';   // ← Asegúrate de tener esta línea
import { NgOptimizedImage } from '@angular/common';
@Component({
  selector: 'app-parter-us',
  imports: [RouterModule, NgOptimizedImage],
  templateUrl: './parter-us.html',
  styleUrl: './parter-us.css'
})
export class ParterUs {

}
