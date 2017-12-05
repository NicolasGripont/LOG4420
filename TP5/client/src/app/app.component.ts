import { Component, ViewChild, ElementRef } from '@angular/core';
import { ShoppingCartService } from './shopping-cart.service';
import { ShoppingCartItem } from './shopping-cart.service';
import {forEach} from "@angular/router/src/utils/collection";

/**
 * Defines the main component of the application.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  @ViewChild('countElement') countElement: ElementRef;


  readonly authors = [
    'Nicolas Gripont',
    'Pierre Bayle'
  ];

  constructor(private shoppingCartService : ShoppingCartService) {
    this.shoppingCartService.totalQuantityChanged.subscribe(() => this.updateCountElementQuantity());
    this.updateCountElementQuantity();
  }

  updateCountElementQuantity() : void {
    var self = this;
    self.shoppingCartService.getShoppingCartItems()
      .then(function (shoppingCartItems : ShoppingCartItem[]) {
        if(!shoppingCartItems || shoppingCartItems.length === 0) {
          self.countElement.nativeElement.hidden = true;
        } else {
          var totalQuantiy = 0;
          shoppingCartItems.forEach(function (item, index) {
            totalQuantiy += item.quantity;
          })
          self.countElement.nativeElement.innerText = "" + totalQuantiy;
          self.countElement.nativeElement.hidden = false;
        }
    })
  }

}
