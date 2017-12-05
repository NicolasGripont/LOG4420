import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Config } from './config';

/**
 * Defines a product.
 */
export class ShoppingCartItem {
  productId : number;
  quantity : number;
}

export class ShoppingCart  {
  items : ShoppingCartItem[];
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
   * Initializes a new instance of the ShoppingCartService class.
   *
   * @param http                    The HTTP service to use.
   */
  constructor(private http: Http) { }

  /**
   * Gets shopping cart in session.
   *
   * @return {Promise<ShoppingCartItem[]>}   The shopping cart items.
   */
  getShoppingCart(): Promise<ShoppingCartItem[]> {
    let url = `${Config.apiUrl}/shopping-cart`;
    return this.http.get(url)
      .toPromise()
      .then(items => items.json() as ShoppingCartItem[])
      .catch(ShoppingCartService.handleError);
  }

  /**
   * Gets the product associated with the product ID specified.
   *
   * @param productId               The product ID associated with the product to retrieve.
   * @returns {Promise<Product>}    A promise that contains the product associated with the ID specified.
   */
  addProductToShoppingCart(productId: number, quantity : number): Promise<number> {
    const url = `${Config.apiUrl}/shopping-cart`;
    var body = {
      productId : productId,
      quantity : quantity
    }
    return this.http.post(url,body)
      .toPromise()
      .then(success => null)
      .catch(error => error.status as number);
  }
}
