import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../services/cart'; // Adjust path if needed
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.html', 
  styleUrls: ['./cart.css']
})
export class CartComponent implements OnInit {
  cartItems$!: Observable<CartItem[]>;
  cartTotal$!: Observable<number>;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.cartItems$ = this.cartService.cartItems$;
    this.cartTotal$ = this.cartService.getCartTotal();
  }

  removeItem(productId: number) {
    if (confirm('Sigur dorești să elimini acest produs?')) {
      this.cartService.removeFromCart(productId);
    }
  }
}
