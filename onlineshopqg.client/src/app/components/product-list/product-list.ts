import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../services/product';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { ToastService } from '../../services/toast'; 

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-list.html',
  styleUrls: []
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = []; 
  brands: any[] = [];
  searchText: string = '';
  categories = ['WOMEN', 'MEN', 'KIDS'];

  constructor(private productService: ProductService, private cartService: CartService, private toastService: ToastService) { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadBrandStats();
  }

  onSearch() {
    if (!this.searchText) {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(product =>
        product.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
  }

  loadBrandStats(): void {
    this.productService.getBrandStats().subscribe(data => {
      this.brands = data;
    });
  }

  loadProducts(category?: string, brand?: string): void {
    this.productService.getProducts(category, brand).subscribe(data => {
      this.products = data;
      this.filteredProducts = data; 
    });
  }

  filterByCategory(cat: string) {
    this.loadProducts(cat, undefined);
  }

  filterByBrand(brand: string) {
    this.loadProducts(undefined, brand);
  }

  showToast = false;

  addToCart(product: any) {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      this.toastService.show('Please log in to add items to your cart!');
    } else {
      this.cartService.addToCart(product);
      this.toastService.show('Product added to cart!');
    }
  }
}
