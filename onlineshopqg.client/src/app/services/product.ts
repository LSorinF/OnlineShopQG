import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})

export class ProductService {

  constructor(private http: HttpClient) { }

  private apiUrl = 'https://localhost:7281/api/products'; 

  getProducts(category?: string, brand?: string): Observable<any[]> {
    let params = new HttpParams();

    if (category && category !== 'undefined') {
      params = params.set('category', category);
    }
  
    if (brand && brand !== 'undefined') {
      params = params.set('brand', brand);
    }

    return this.http.get<any[]>(this.apiUrl, { params });
  }

  getBrandStats(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/brand-stats`);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }
}
