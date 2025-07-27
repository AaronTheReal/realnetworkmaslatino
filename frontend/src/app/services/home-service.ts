// home.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface CarouselItem {
  _id?: string;
  title: string;
  subtitle?: string;
  description?: string;
  type: 'podcast' | 'noticia' | 'reel' | 'video' | 'evento' | 'custom';
  coverImage: string;
  videoUrl?: string;
  audioUrl?: string;
  linkUrl: string;
  relatedId?: string;
  position?: number;
  isActive?: boolean;
  tags?: string[];
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class HomeService {
  private baseUrl = 'http://localhost:3000/aaron/maslatinoNetwork/best-content';

  constructor(private http: HttpClient) {}

  getAllCarouselItems(): Observable<CarouselItem[]> {
    return this.http.get<CarouselItem[]>(`${this.baseUrl}`);
  }

  getCarouselItemById(id: string): Observable<CarouselItem> {
    return this.http.get<CarouselItem>(`${this.baseUrl}/${id}`);
  }

  createCarouselItem(data: CarouselItem): Observable<CarouselItem> {
    return this.http.post<CarouselItem>(`${this.baseUrl}`, data);
  }

  updateCarouselItem(id: string, data: Partial<CarouselItem>): Observable<CarouselItem> {
    return this.http.put<CarouselItem>(`${this.baseUrl}/${id}`, data);
  }

  deleteCarouselItem(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }
}
