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

  orderId : string;
  firstName : string;
  lastName : string;

  constructor(private activatedRoute: ActivatedRoute) {
    this.orderId = this.activatedRoute.snapshot.queryParams['orderId'];
    this.firstName = this.activatedRoute.snapshot.queryParams['firstName'];
    this.lastName = this.activatedRoute.snapshot.queryParams['lastName'];
  }

}

