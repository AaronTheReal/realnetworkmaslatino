import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-footer',
  imports: [RouterModule,CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  standalone: true

})
export class FooterComponent {

}
