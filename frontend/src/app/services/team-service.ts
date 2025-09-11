import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface TeamMember {
  _id?: string;
  name: string;
  position: string;
  imageUrl: string;
  order?: number;
  linkedinUrl?: string;
  createdAt?: string;
  bio?: string; // ← añade esto si lo tienes en tu base de datos
  description?: string; // ← opcional si usas otro nombre
}

@Injectable({ providedIn: 'root' })
export class TeamService {
  //private baseUrl = 'http://localhost:3000/aaron/maslatinoNetwork/team';
  private baseUrl = 'https://realnetworkmaslatino.onrender.com/aaron/maslatinoNetwork/team';

  constructor(private http: HttpClient) {}

  // Obtener todos los miembros del equipo
  getAll(): Observable<TeamMember[]> {
    console.log("llega?");
    return this.http.get<TeamMember[]>(this.baseUrl);
  }

  // Obtener un miembro específico
  getById(id: string): Observable<TeamMember> {
    return this.http.get<TeamMember>(`${this.baseUrl}/${id}`);
  }

  // Crear nuevo miembro
  create(data: TeamMember): Observable<TeamMember> {
    return this.http.post<TeamMember>(this.baseUrl, data);
  }

  // Editar un miembro
  update(id: string, data: Partial<TeamMember>): Observable<TeamMember> {
    return this.http.put<TeamMember>(`${this.baseUrl}/${id}`, data);
  }

  // Eliminar un miembro
  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }

  // Reordenar miembros (orden en lote)
  reorder(items: { id: string; order: number }[]): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.baseUrl}/reorder`, { items });
  }
}
