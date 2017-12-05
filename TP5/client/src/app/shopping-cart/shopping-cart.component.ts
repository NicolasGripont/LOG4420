import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../products.service';
import { ShoppingCartService } from '../shopping-cart.service';
import { ShoppingCart } from '../shopping-cart.service';


/**
 * Defines the component responsible to manage the shopping cart page.
 */
@Component({
  selector: 'shopping-cart',
  templateUrl: './shopping-cart.component.html'
})
export class ShoppingCartComponent implements OnInit {

  shoppingCart : ShoppingCart;

  constructor(private route: ActivatedRoute, private productsService : ProductsService, private shoppingCartService : ShoppingCartService) {
    var self = this;
    this.shoppingCart = null;
  }

  ngOnInit() {
    this.getShoppingCart();
  }

  getShoppingCart(): void {
    var self = this;
    self.shoppingCartService.getFullShoppingCartItems()
      .then(function (shoppingCart) {
        self.shoppingCart = shoppingCart;
      });
  }

  removeItem(event, item) {
    var self = this;
    self.shoppingCartService.removeItemFromShoppingCart(item.product.id)
      .then(function (error) {
        if(!error) {
          self.getShoppingCart();
        }
      });
  }

  decrementItemQuantity(event, item) {
    var self = this;
    self.shoppingCartService.updateProductQuantityInShoppingCart(item.product.id,item.quantity - 1)
      .then(function (error) {
        if(!error) {
          self.getShoppingCart();
        }
      });
  }

  incrementItemQuantity(event, item) {
    var self = this;
    self.shoppingCartService.updateProductQuantityInShoppingCart(item.product.id,item.quantity + 1)
      .then(function (error) {
        if(!error) {
          self.getShoppingCart();
        }
      });
  }

  removeAllItems(event){
    var self = this;
    self.shoppingCartService.removeAllItemsFromShoppingCart()
      .then(function (error) {
        if(!error) {
          self.getShoppingCart();
        }
      });
  }

}
