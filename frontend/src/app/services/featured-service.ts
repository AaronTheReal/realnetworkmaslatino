// src/app/services/featured-page.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface FeaturedPage {
  _id?: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  author?: string;
  description: string;
  order?: number;
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class FeaturedPageService {
  // Ajusta el endpoint según tu backend
  //private baseUrl = 'https://realnetworkmaslatino.onrender.com/aaron/maslatinoNetwork/featured-pages';
  //private baseUrl = 'http://localhost:3000/aaron/maslatinoNetwork/featured-pages';
  private baseUrl  = 'https://realnetworkmaslatino-teas.onrender.com/aaron/maslatinoNetwork/featured-pages'; 
  constructor(private http: HttpClient) {}

  // READ ALL
  getAll(): Observable<{ data: FeaturedPage[], pagination: any }> {
    return this.http.get<{ data: FeaturedPage[], pagination: any }>(`${this.baseUrl}`);
  }

  // READ ONE
  getById(id: string): Observable<FeaturedPage> {
    return this.http.get<FeaturedPage>(`${this.baseUrl}/${id}`);
  }

  // CREATE
  create(data: FeaturedPage): Observable<FeaturedPage> {
    return this.http.post<FeaturedPage>(`${this.baseUrl}`, data);
  }

  // UPDATE
  update(id: string, data: Partial<FeaturedPage>): Observable<FeaturedPage> {
    return this.http.put<FeaturedPage>(`${this.baseUrl}/${id}`, data);
  }

  // DELETE
  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }

  // REORDER (bulk)
  reorder(items: { id: string; order: number }[]): Observable<{ message: string; data: FeaturedPage[] }> {
    return this.http.post<{ message: string; data: FeaturedPage[] }>(`${this.baseUrl}/reorder`, { items });
  }
}
