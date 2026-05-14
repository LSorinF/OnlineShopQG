import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = 'https://localhost:7281/api/orders'; 

  constructor(private http: HttpClient) { }

  placeOrder(orderPayload: any): Observable<any> {
    return this.http.post(this.apiUrl, orderPayload);
  }
}
