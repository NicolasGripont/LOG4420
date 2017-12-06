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

  /**
   * The order form.
   */
  orderForm: any;

  /**
   * The first name html input.
   */
  @ViewChild('firstNameElement') firstNameElement: ElementRef;

  /**
   * The last name html input.
   */
  @ViewChild('lastNameElement') lastNameElement: ElementRef;

  /**
   * The email html input.
   */
  @ViewChild('emailElement') emailElement: ElementRef;

  /**
   * The phone html input.
   */
  @ViewChild('phoneElement') phoneElement: ElementRef;

  /**
   * The credit card html input.
   */
  @ViewChild('creditCardElement') creditCardElement: ElementRef;

  /**
   * The credit card expiry html input.
   */
  @ViewChild('creditCardExpiryElement') creditCardExpiryElement: ElementRef;

  /**
   * Initializes a new instance of the ProductComponent class.
   *
   * @param {Router} router       The router that provides the navigation and url manipulation capabilities.
   * @param {OrderService}        The order service which manage order api call.
   * @param {ShoppingCartService} The shopping cart service which manage shopping cart api call.
   */
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
                self.router.navigate(['/confirmation'],
                  {queryParams: {orderId : order.id, firstName : order.firstName, lastName : order.lastName}});
              })
            }
          })
        })
      });
  }
}
