import { CartDataService } from './cart-data.service';
import { Injectable } from '@angular/core';
import { CartItem } from '../core/interfaces/cart-item.interface';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../core/interfaces/product.interface';

interface CartProducts {
  items: CartItem[];
  total: number;
}

@Injectable()
export class CartService {
  protected _products = {
    items: [],
    total: 0,
  };

  protected _cartState = new Subject<CartProducts>();

  constructor(
    protected dataService: CartDataService,
  ) { }

  getStoredCartItems() {
    this.dataService.fetchAll().subscribe((items: CartItem[]) => {
      this.setCartItems(items)
    })
  }

  addProduct(product: Product) {
    const existingItem = this.getItems().find(item => item.product.id === product.id)

    if (existingItem) {
      existingItem.amount++;
      this.calculateSubtotal(existingItem)
    } else {
      const newItem: CartItem = {
        id: product.id,
        amount: 1,
        product: product,
        subtotal: product.price
      }

      this.getItems().push(newItem);
    }

    this.setCartItems(this.getItems())
  }

  removeProduct(product: Product, shouldRemoveAll = false) {
    const existingItem = this.getItems().find((item) => item.product.id === product.id);

    if (!existingItem) return;

    if (shouldRemoveAll || existingItem.amount === 1) {
      const index = this.getItems().indexOf(existingItem);
      if (index !== -1) this.getItems().splice(index, 1);
    } else {
      existingItem.amount--;
      this.calculateSubtotal(existingItem);
    }

    this.setCartItems(this.getItems());
  }

  clearAll() {
    this.getItems().length = 0;
    this.setCartItems(this.getItems());
  }

  //HELPER METHODS

  protected updateCartState(products: CartProducts) {
    this._products = products;
    this._cartState.next(products);
  }

  protected calculateTotal(items: CartItem[]): number {
    return items.reduce((total, item) => total += item.subtotal, 0);
  }

  protected calculateSubtotal(item: CartItem): CartItem {
    item.subtotal = item.product.price * item.amount;
    return item;
  }

  protected getProducts() {
    return this._products;
  }

  protected setCartItems(items: CartItem[]) {
    const total = this.calculateTotal(items)
    const products = { items, total };

    this.updateCartState(products);
  }

  getItems() {
    return this.getProducts().items;
  }

  getItem(id: number) {
    return this.getProducts().items.find(item => item.id === id);
  }

  getTotal() {
    return this.getProducts().total;
  }

  getCartUpdates() {
    return this._cartState.pipe(map(() => this.getItems()));
  }

  getItemUpdates(id: number) {
    return this._cartState.pipe(map(() => this.getItem(id)));
  }

  getTotalUpdates() {
    return this._cartState.pipe(map((s) => s.total));
  }
}
