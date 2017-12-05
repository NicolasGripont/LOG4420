import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import { ShoppingCartService, ShoppingCartItem } from "../shopping-cart.service";
import { OrderService, Order, OrderItem } from "../order.service";

declare const $: any;

/**
 * Defines the component responsible to manage the order page.
 */
@Component({
  selector: 'order',
  templateUrl: './order.component.html'
})
export class OrderComponent implements OnInit {

  orderForm: any;
  @ViewChild('firstNameElement') firstNameElement: ElementRef;
  @ViewChild('lastNameElement') lastNameElement: ElementRef;
  @ViewChild('emailElement') emailElement: ElementRef;
  @ViewChild('phoneElement') phoneElement: ElementRef;
  @ViewChild('creditCardElement') creditCardElement: ElementRef;
  @ViewChild('creditCardExpiryElement') creditCardExpiryElement: ElementRef;

  constructor(private router : Router, private orderService: OrderService, private  shoppingCartService : ShoppingCartService) {
  }

  /**
   * Occurs when the component is initialized.
   */
  ngOnInit() {
    // Initializes the validation of the form. This is the ONLY place where jQuery usage is allowed.
    this.orderForm = $('#order-form');
    $.validator.addMethod('ccexp', function(value) {
      if (!value) {
        return false;
      }
      const regEx = /^(0?[1-9]|1[0-2])\/(0?[1-9]|[1-9][0-9])$/g;
      return regEx.test(value);
    }, 'La date d\'expiration de votre carte de crédit est invalide.');
    this.orderForm.validate({
      rules: {
        'phone': {
          required: true,
          phoneUS: true
        },
        'credit-card': {
          required: true,
          creditcard: true
        },
        'credit-card-expiry': {
          ccexp: true
        }
      }
    });
  }

  /**
   * Submits the order form.
   */
  submit() {
    var self = this;
    if (!self.orderForm.valid()) {
      return;
    }
    self.shoppingCartService.getShoppingCartItems()
      .then(function (shoppingCartItems) {
        var orderItems = [];
        shoppingCartItems.forEach(function (item, i) {
          var orderItem = new OrderItem;
          orderItem.id = item.productId;
          orderItem.quantity = item.quantity;
          orderItems.push(orderItem);
        })
        var order = new Order();
        self.orderService.getNewAvailableId().then(function (id) {
          console.log(id);
          order.id = id;
          order.firstName = self.firstNameElement.nativeElement.value;
          order.lastName = self.lastNameElement.nativeElement.value;
          order.email = self.emailElement.nativeElement.value;
          order.phone = self.phoneElement.nativeElement.value.replace(/-/g,'');
          order.products = orderItems;
          console.log(order);
          self.orderService.createOrder(order).then(function (error) {
            if(!error){
              self.shoppingCartService.removeAllItemsFromShoppingCart().then(function () {
                self.router.navigateByUrl("confirmation");
              })
            }
          })
        })
      });

  }
}
