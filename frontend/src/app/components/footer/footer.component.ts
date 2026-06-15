import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, NgOptimizedImage } from '@angular/common';


@Component({
  selector: 'app-footer',
  imports: [RouterModule, CommonModule, NgOptimizedImage],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  standalone: true

})
export class FooterComponent {

}
