import { Injectable, EventEmitter } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Config } from './config';
import { ProductsService, Product } from './products.service';

/**
 * Defines a shopping cart item.
 */
export class ShoppingCartItem {
  productId : number;
  quantity : number;
}

/**
 * Defines a full shopping cart item.
 */
export class FullShoppingCartItem {
  product : Product;
  quantity : number;
}

/**
 * Defines a shopping cart with full shopping cart item.
 */
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

  /**
   * Create an http options object to allow cookies between different server origins.
   *
   * @returns {RequestOptions}  The options object.
   */
  private static getOptions() {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers, withCredentials: true });
    return options;
  }

  /**
   * Event raised when product quantity in shopping cart changed.
   *
   * @type {EventEmitter<void>} The event raised.
   */
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
   * @return {Promise<ShoppingCartItem[]>}   A promise that contains the shopping cart items.
   */
  getShoppingCartItems(): Promise<ShoppingCartItem[]> {
    let url = `${Config.apiUrl}/shopping-cart`;
    return this.http.get(url, ShoppingCartService.getOptions())
      .toPromise()
      .then(items => items.json() as ShoppingCartItem[])
      .catch(() => null);
  }

  /**
   * Gets shopping cart item from shopping cart in session corresponding to productId.
   *
   * @param productId                       Id of the product to get.
   * @return {Promise<ShoppingCartItem>}    A promise that contains the shopping cart item associated with the ID
   *                                        specified.
   */
  getShoppingCartItem(productId): Promise<ShoppingCartItem> {
    let url = `${Config.apiUrl}/shopping-cart/${productId}`;
    return this.http.get(url, ShoppingCartService.getOptions())
      .toPromise()
      .then(item => item.json() as ShoppingCartItem)
      .catch(() => null);
  }

  /**
   * Add a new product to the shopping cart in session.
   *
   * @param productId               The product ID of the new product to add.
   * @param quantity                The quantity of the ne product to add.
   * @returns {Promise<number>}    A promise that contains null if success or the error status if fail.
   *                                If success, the promises raised this.totalQuatityChanged event.
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
   * Update quantity of a product in the shopping cart in session.
   *
   * @param productId               The product ID of the product quantity to update.
   * @param quantity                The new quantity of the ne product.
   * @returns {Promise<number>}    A promise that contains null if success or the error status if fail.
   *                                If success, the promises raised this.totalQuatityChanged event.
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


  /**
   * Gets shopping cart stored in session.
   *
   * @returns {Promise<ShoppingCart>}  A promise that contains the shopping cart.
   */
  getShoppingCart(): Promise<ShoppingCart> {
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

  /**
   * Remove the product corresponding to the productId from shopping cart.
   *
   * @returns {Promise<number>}    A promise that contains null if success or the error status if fail.
   *                                If success, the promises raised this.totalQuatityChanged event.
   */
  removeItemFromShoppingCart(productId) {
    var self = this;
    const url = `${Config.apiUrl}/shopping-cart/${productId}`;
    return self.http.delete(url, ShoppingCartService.getOptions())
      .toPromise()
      .then(success => { self.totalQuantityChanged.next(); return null})
      .catch(error => error.status as number);
  }

  /**
   * Remove all products from shopping cart.
   *
   * @returns {Promise<number>}    A promise that contains null if success or the error status if fail.
   *                                If success, the promises raised this.totalQuatityChanged event.
   */
  removeAllItemsFromShoppingCart() {
    var self = this;
    const url = `${Config.apiUrl}/shopping-cart`;
    return self.http.delete(url, ShoppingCartService.getOptions())
      .toPromise()
      .then(success => { self.totalQuantityChanged.next(); return null})
      .catch(error => error.status as number);
  }

}
