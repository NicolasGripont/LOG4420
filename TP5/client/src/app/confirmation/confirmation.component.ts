import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { OrderService, Order } from "../order.service";

/**
* Defines the component responsible to manage the confirmation page.
*/
@Component({
  selector: 'confirmation',
  templateUrl: './confirmation.component.html'
})
export class ConfirmationComponent {

  order : Order;

  constructor(private orderService: OrderService) {
    this.order = null;
  }

  /**
   * Occurs when the component is initialized.
   */
  ngOnInit() {
    this.order = this.orderService.getOrderFromSessionStorage();
  }

}
