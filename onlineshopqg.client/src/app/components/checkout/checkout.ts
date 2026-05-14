import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from '../../services/cart'; // Verifică calea corectă
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrls: []
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = [];
  user: any = null;
  totalOrder: number = 0;
  isEditingShipping = false;

  constructor(
    private cartService: CartService, 
    private authService: AuthService,
    private orderService: OrderService,
    private toastService: ToastService,
    private router: Router
  ) { }

  ngOnInit() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });

    this.cartService.getCartTotal().subscribe(total => {
      this.totalOrder = total;
    });

    this.authService.currentUser$.subscribe((loggedUser: any) => { 
      if (loggedUser && typeof loggedUser !== 'string' && loggedUser.id) {
        this.authService.getUserProfile(loggedUser.id).subscribe(fullProfile => {
          this.user = fullProfile;
        });
      } else if (loggedUser && typeof loggedUser === 'string') {
        this.authService.getUserProfile(Number(loggedUser)).subscribe(fullProfile => {
          this.user = fullProfile;
        });
      }
    });
  }

  confirmPurchase() {
    // Verify cart not empty
    if (this.cartItems.length === 0) {
      this.toastService.show('Your cart is empty!');
      return;
    }

    // Build full address string
    const fullAddress = `${this.user.addressLine}, ${this.user.city}, ${this.user.state}, ${this.user.country}`;

    const orderPayload = {
      userId: this.user.id,
      totalAmount: this.totalOrder,
      shippingAddress: fullAddress,
      items: this.cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price
      }))
    };

    // 4. Trimitem comanda către serviciu
    this.orderService.placeOrder(orderPayload).subscribe({
      next: (response) => {
        this.toastService.show('🎉 Order placed successfully!');

        this.cartService.clearCart();

        // Redirect to home after a short delay
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      },
      error: (err) => {
        console.error('Eroare la plasarea comenzii:', err);
        alert('A apărut o problemă la plasarea comenzii.');
      }
    });
  }

  toggleEdit() {
    this.isEditingShipping = !this.isEditingShipping;
  }

  saveShipping() {
    this.authService.updateUserProfile(this.user).subscribe({
      next: () => {
        this.isEditingShipping = false;
        this.toastService.show('Shipping details updated successfully!');
      },
      error: (err) => {
        console.error("Update failed", err);
        alert("A apărut o eroare la salvarea adresei.");
      }
    });
  }
} 
