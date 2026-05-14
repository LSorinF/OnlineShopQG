import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService } from './services/cart';
import { AuthService } from './services/auth'; 
import { ToastService } from './services/toast'; 
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.html'
})
export class AppComponent implements OnInit {
  cartItemCount$!: Observable<number>;
  currentUser$: Observable<any>;

  constructor
    (
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    public toastService: ToastService  )
    {
    this.currentUser$ = this.authService.currentUser$;
    }

  ngOnInit() {
    this.cartItemCount$ = this.cartService.getCartItemCount();
    this.currentUser$ = this.authService.currentUser$;
  }

  logout() {
    this.authService.logout();
    this.cartService.clearCart();
    this.router.navigate(['/login']);
  }
}
