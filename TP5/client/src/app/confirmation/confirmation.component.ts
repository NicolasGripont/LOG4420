import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/**
 * Defines the component responsible to manage the confirmation page.
 */
@Component({
  selector: 'confirmation',
  templateUrl: './confirmation.component.html'
})
export class ConfirmationComponent {

  /**
   * The order id to display.
   */
  orderId : string;

  /**
   * The first name to display.
   */
  firstName : string;

  /**
   * The last name to display.
   */
  lastName : string;

  /**
   * Initializes a new instance of the ConfirmationComponent class.
   *
   * @param {ActivatedRoute}      The active route.
   */
  constructor(private activatedRoute: ActivatedRoute) {
    this.orderId = this.activatedRoute.snapshot.queryParams['orderId'];
    this.firstName = this.activatedRoute.snapshot.queryParams['firstName'];
    this.lastName = this.activatedRoute.snapshot.queryParams['lastName'];
  }

}

