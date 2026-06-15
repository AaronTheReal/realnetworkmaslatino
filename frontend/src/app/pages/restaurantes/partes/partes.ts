import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

// Identificador de cada sección/categoría seleccionable
export type SectionKey = 'eventos' | 'hangout' | 'fanzone' | 'turismo' | 'restaurantes';

@Component({
  selector: 'app-partes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './partes.html',
  styleUrl: './partes.css',
})
export class Partes {
categories: { subtitle: string; title: string; bg: string; icon: string; id: SectionKey }[] = [
  {
    subtitle: 'Para entretener',
    title: 'Eventos',
    bg: 'bg-[#fe0900]',
    icon: 'assets/iconospartes/eventos.webp',
    id: 'eventos',
  },
  {
    subtitle: 'Para pasar el tiempo',
    title: 'Hang out',
    bg: 'bg-[#b121fe]',
    icon: 'assets/iconospartes/hangout.webp',
    id: 'hangout',
  },
  {
    subtitle: 'Vive experiencias',
    title: 'Fan Zone',
    bg: 'bg-[#00cf82]',
    icon: 'assets/iconospartes/fanzone.webp',
    id: 'fanzone',
  },
  {
    subtitle: 'Recorre la ciudad',
    title: 'Turismo',
    bg: 'bg-[#fdb700]',
    icon: 'assets/iconospartes/turismo.webp',
    id: 'turismo',
  },
];

foodCategory: { subtitle: string; title: string; bg: string; icon: string; id: SectionKey } = {
  subtitle: 'Para comer',
  title: 'Los mejores restaurantes',
  bg: 'bg-[#b121fe]',
  icon: 'assets/iconospartes/restaurantes.webp',
  id: 'restaurantes',
};

// Sección actualmente seleccionada (controlada por el componente padre)
selectedSection = input<SectionKey>('restaurantes');

// Emite la sección elegida al hacer click en una tarjeta
sectionSelected = output<SectionKey>();
}