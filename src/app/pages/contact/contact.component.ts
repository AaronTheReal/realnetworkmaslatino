import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import emailjs from 'emailjs-com';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
 imports: [CommonModule, RouterModule, FormsModule],

  templateUrl: './contact.html',
  styleUrls: ['./contact.css'],
  standalone: true
})



export class ContactComponent {


   formData = {
    name: '',
    email: '',
    message: ''
  };

  ngOnInit() {}


  sendEmail() {
    const serviceID = 'service_rgwcc09';       // ej: 'gmail_service'
    const templateID = 'template_7nvyzai';     // ej: 'template_contact'
    const publicKey = 'ZDVmu3FqWRTz4ZT0j';       // ej: 'your_public_key'

    emailjs.send(serviceID, templateID, this.formData, publicKey)
      .then(() => {
        alert('Mensaje enviado con éxito');
        this.formData = { name: '', email: '', message: '' }; // limpiar campos
      })
      .catch((error) => {
        console.error('Error al enviar:', error);
        alert('Hubo un error al enviar el mensaje.');
      });
  }

}
