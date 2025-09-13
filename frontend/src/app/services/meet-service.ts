// services/voice-service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface VoiceMember {
  _id?: string;
  name: string;
  role: string;
  imageUrl?: string;
  bio?: string;
  order?: number;
  isActive?: boolean;
  tags?: string[];
  socials?: {
    instagram?: string;
    twitter?: string;
    tiktok?: string;
    facebook?: string;
    youtube?: string;
    website?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({ providedIn: 'root' })
export class VoiceService {
  private baseUrl = 'https://realnetworkmaslatino-teas.onrender.com/aaron/maslatinoNetwork/voices';
  //private baseUrl = 'http://localhost:3000/aaron/maslatinoNetwork/voices';
   //private baseUrl = '/aaron/maslatinoNetwork/best-content';
  //private baseUrl = 'https://realnetworkmaslatino.onrender.com/aaron/maslatinoNetwork/voices';

  constructor(private http: HttpClient) {}

  getAll(): Observable<VoiceMember[]> {
    return this.http
      .get<{ data: VoiceMember[] }>(this.baseUrl)
      .pipe(map((res) => res.data));
  }

  getById(id: string): Observable<VoiceMember> {
    return this.http.get<VoiceMember>(`${this.baseUrl}/${id}`);
  }

  create(data: VoiceMember): Observable<VoiceMember> {
    return this.http.post<VoiceMember>(this.baseUrl, data);
  }

  update(id: string, data: Partial<VoiceMember>): Observable<VoiceMember> {
    return this.http.put<VoiceMember>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }

  reorder(items: { id: string; order: number }[]): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.baseUrl}/reorder`, { items });
  }
}
