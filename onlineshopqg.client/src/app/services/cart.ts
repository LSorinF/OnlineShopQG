import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth';

export interface CartItem {
  id?: number;
  userId: number;
  productId: number;
  quantity: number;
  product?: any; 
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = 'https://localhost:7281/api/cart';
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItems.asObservable();

  constructor(private http: HttpClient, private authService: AuthService)
  {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        const userId = localStorage.getItem('userId');
        if (userId) {
          this.loadCartFromDb(Number(userId));
        }
      } else {
        this.clearCart();
      }
    });
  }

  loadCartFromDb(userId: number) {
    this.http.get<any[]>(`${this.apiUrl}/${userId}`).subscribe({
      next: (items) => {
        console.log('Cart loaded from DB:', items);
        this.cartItems.next(items);
      },
      error: (err) => console.error('Failed to sync cart', err)
    });
  }

  clearCart() {
    this.cartItems.next([]);
  }

  addToCart(product: any, quantity: number = 1) {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    const payload = {
      userId: Number(userId),
      productId: product.id,
      quantity: quantity 
    };

    this.http.post(`${this.apiUrl}/add`, payload).subscribe({
      next: () => {
        this.loadCartFromDb(Number(userId));
      },
      error: (err) => console.error('Eroare la adăugarea în coș', err)
    });
  }

  getCartItemCount(): Observable<number> {
    return this.cartItems$.pipe(
      map(items => items.reduce((total, item) => total + item.quantity, 0))
    );
  }

  getCartTotal(): Observable<number> {
    return this.cartItems$.pipe(
      map(items => items.reduce((total, item) => {
        const price = item.product?.price || 0;
        return total + (price * item.quantity);
      }, 0))
    );
  }

  removeFromCart(productId: number) {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    this.http.delete(`${this.apiUrl}/remove/${userId}/${productId}`).subscribe({
      next: () => {
        this.loadCartFromDb(Number(userId));
      },
      error: (err) => console.error('Eroare la ștergere:', err)
    });
  }
}
