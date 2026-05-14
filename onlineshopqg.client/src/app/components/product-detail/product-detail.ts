import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart';
import { ToastService } from '../../services/toast';
import { ProductService } from '../../services/product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ProductDetailComponent implements OnInit {
  product: any;
  quantity: number = 1; 

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private toastService: ToastService,
    private productService: ProductService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProductById(Number(id)).subscribe({
        next: (data) => {
          console.log('Am primit produsul:', data); 
          this.product = data;
        },
        error: (err) => {
          console.error('Eroare la încărcarea produsului:', err);
        }
      });
    }
  }

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      this.toastService.show('Please log in to add items to your cart!');
    }
    else{
      this.cartService.addToCart(this.product, this.quantity);
      this.toastService.show(`${this.quantity}x ${this.product.name} added to cart!`);
    }
  }
}
