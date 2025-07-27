import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-panel',
  imports: [RouterModule,CommonModule],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css',
  standalone:true
})
export class AdminPanelComponent {

}
