import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Config } from './config';
import {ShoppingCartService } from "./shopping-cart.service";

export class OrderItem {
  id : number;
  quantity : number;
}

export class Order {
  id : number;
  firstName : string;
  lastName : string;
  email : string;
  phone : string;
  products : OrderItem[];

}

/**
 * Defines the service responsible to manage the shopping cart in the session.
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


  createOrder(order : Order): Promise<number> {
    var self = this;
    let url = `${Config.apiUrl}/orders`;
    return self.http.post(url, order, OrderService.getOptions())
      .toPromise()
      .then(success =>  null)
      .catch(error => error.status as number);
  }

  getNewAvailableId(): Promise<number> {
    let url = `${Config.apiUrl}/orders/ids/newIdAvailable`;
    return this.http.get(url, OrderService.getOptions())
      .toPromise()
      .then(result => { console.log("newId="+result.json()); return result.json() as number})
      .catch(error => error.status as number);
  }

}
