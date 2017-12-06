import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Config } from './config';
import { ShoppingCartService } from "./shopping-cart.service";

/**
 * Defines an order item.
 */
export class OrderItem {
  id : number;
  quantity : number;
}

/**
 * Defines an order.
 */
export class Order {
  id : number;
  firstName : string;
  lastName : string;
  email : string;
  phone : string;
  products : OrderItem[];

}

/**
 * Defines the service responsible to manage the order.
 */
@Injectable()
export class OrderService {

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
   * Initializes a new instance of the OrderService class.
   *
   * @param http                    The HTTP service to use.
   */
  constructor(private http: Http, private  shoppingCartService: ShoppingCartService) { }

  /**
   * Create an order.
   *
   * @param order                           The order to create.
   * @return {Promise<number>}   A promise that contains null if success or the error status if fail.
   *                                       If success, the promises raised this.totalQuatityChanged event.
   */
  createOrder(order : Order): Promise<number> {
    var self = this;
    let url = `${Config.apiUrl}/orders`;
    return self.http.post(url, order, OrderService.getOptions())
      .toPromise()
      .then(success =>  null)
      .catch(error => error.status as number);
  }

  /**
   * Gets the first available ID to create a new order.
   *
   * @param productId             Id of the product to get.
   * @return {Promise<number>}    A promise that contains the first available ID to create a new order
   *                              or null if error.
   */
  getNewAvailableId(): Promise<number> {
    let url = `${Config.apiUrl}/orders/ids/newIdAvailable`;
    return this.http.get(url, OrderService.getOptions())
      .toPromise()
      .then(result => { return result.json() as number})
      .catch(error => null);
  }

}
