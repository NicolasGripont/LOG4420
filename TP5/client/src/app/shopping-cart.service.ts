import { Injectable, EventEmitter } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Config } from './config';
import { ProductsService } from './products.service';
import { Product } from './products.service';

/**
 * Defines a product.
 */
export class ShoppingCartItem {
  productId : number;
  quantity : number;
}

export class FullShoppingCartItem {
  product : Product;
  quantity : number;
}

export class ShoppingCart {
  items : FullShoppingCartItem[];
  total : number;
}

/**
 * Defines the service responsible to manage the shopping cart in the session.
 */
@Injectable()
export class ShoppingCartService {

  /**
   * Handles the current error.
   *
   * @param error                   The error to handle.
   * @return {Promise<object>}      A promise object.
   */
  private static handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.feedbackMessage || error);
  }

  private static getOptions() {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers, withCredentials: true });
    return options;
  }

  public totalQuantityChanged: EventEmitter<void> = new EventEmitter<void>();


  /**
   * Initializes a new instance of the ShoppingCartService class.
   *
   * @param http                    The HTTP service to use.
   */
  constructor(private http: Http, private  productsService: ProductsService) { }

  /**
   * Gets shopping cart in session.
   *
   * @return {Promise<ShoppingCartItem[]>}   The shopping cart items.
   */
  getShoppingCartItems(): Promise<ShoppingCartItem[]> {
    let url = `${Config.apiUrl}/shopping-cart`;
    return this.http.get(url, ShoppingCartService.getOptions())
      .toPromise()
      .then(items => items.json() as ShoppingCartItem[])
      .catch(() => null);
  }

  /**
   * Gets product from shopping cart in session.
   *
   * @param productId                      Id of the product to get.
   * @return {Promise<ShoppingCartItem>}   The product from shopping cart corresponding to the productId.
   */
  getShoppingCartItem(productId): Promise<ShoppingCartItem> {
    let url = `${Config.apiUrl}/shopping-cart/${productId}`;
    return this.http.get(url, ShoppingCartService.getOptions())
      .toPromise()
      .then(item => item.json() as ShoppingCartItem)
      .catch(() => null);
  }

  /**
   * Add a new product to the shopping cart.
   *
   * @param productId               The product ID of the new  product to add.
   * @param productId               The quantity of the ne product to add.
   * @returns {Promise<Product>}    A promise that contains the product associated with the ID specified.
   */
  addNewProductToShoppingCart(productId: number, quantity : number): Promise<number> {
    var self = this;
    const url = `${Config.apiUrl}/shopping-cart`;
    var body = {
      productId : productId,
      quantity : quantity
    }
    return self.http.post(url,body, ShoppingCartService.getOptions())
      .toPromise()
      .then(success => { self.totalQuantityChanged.next(); return null})
      .catch(error => error.status as number);
  }

  /**
   * Gets the product associated with the product ID specified.
   *
   * @param productId               The product ID associated with the product to retrieve.
   * @returns {Promise<Product>}    A promise that contains the product associated with the ID specified.
   */
  updateProductQuantityInShoppingCart(productId: number, quantity : number): Promise<number> {
    var self = this;
    const url = `${Config.apiUrl}/shopping-cart/${productId}`;
    var body = {
      quantity : quantity
    }
    return self.http.put(url,body, ShoppingCartService.getOptions())
      .toPromise()
      .then(success => { self.totalQuantityChanged.next(); return null})
      .catch(error => error.status as number);
  }


  getFullShoppingCartItems(): Promise<ShoppingCart> {
    var self = this;
    let url = `${Config.apiUrl}/shopping-cart`;
    return self.http.get(url, ShoppingCartService.getOptions())
      .toPromise()
      .then(items => {
        var shoppingCartItems = items.json() as ShoppingCartItem[];
        var shoppingCart = new ShoppingCart();
        shoppingCart.items = [];
        shoppingCart.total = 0;
        return self.productsService.getProducts("alpha-asc","all")
          .then(function (products) {
            products.forEach(function (product, i) {
              var item = shoppingCartItems.find(item => item.productId == product.id);
              if(item) {
                shoppingCart.items.push({product: product, quantity: item.quantity});
                shoppingCart.total += product.price * item.quantity;
              }
            });
            return shoppingCart;
          }
        )
      })
      .catch(() => null);
  }

  removeItemFromShoppingCart(productId) {
    var self = this;
    const url = `${Config.apiUrl}/shopping-cart/${productId}`;
    return self.http.delete(url, ShoppingCartService.getOptions())
      .toPromise()
      .then(success => { self.totalQuantityChanged.next(); return null})
      .catch(error => error.status as number);
  }

  removeAllItemsFromShoppingCart() {
    var self = this;
    const url = `${Config.apiUrl}/shopping-cart`;
    return self.http.delete(url, ShoppingCartService.getOptions())
      .toPromise()
      .then(success => { self.totalQuantityChanged.next(); return null})
      .catch(error => error.status as number);
  }

}
