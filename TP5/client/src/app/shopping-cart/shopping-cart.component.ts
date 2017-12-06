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

  /**
   * The shopping cart to display
   */
  shoppingCart : ShoppingCart;

  /**
   * Initializes a new instance of the ShoppingCartComponent class.
   *
   * @param {ShoppingCartService} The shopping cart service which manage shopping cart api call.
   */
  constructor(private shoppingCartService : ShoppingCartService) {
    this.shoppingCart = null;
  }

  /**
   * Occurs when the component is initialized.
   */
  ngOnInit() {
    this.getShoppingCart();
  }

  /**
   * Gets and show the shopping cart.
   * If product doesn't exist, show empty shopping cart message.
   */
  getShoppingCart(): void {
    var self = this;
    self.shoppingCartService.getShoppingCart()
      .then(function (shoppingCart) {
        self.shoppingCart = shoppingCart;
      });
  }

  /**
   * Remove the item from the shopping cart.
   *
   * @param item   Item to remove.
   */
  removeItem(item) {
    var self = this;
    if(confirm("Voulez-vous supprimer le produit du panier?")) {
      self.shoppingCartService.removeItemFromShoppingCart(item.product.id)
        .then(function (error) {
          if (!error) {
            self.getShoppingCart();
          }
        });
    }
  }

  /**
   * Decrement item quantity.
   *
   * @param item   Item to decrement quantity.
   */
  decrementItemQuantity(item) {
    var self = this;
    self.shoppingCartService.updateProductQuantityInShoppingCart(item.product.id,item.quantity - 1)
      .then(function (error) {
        if(!error) {
          self.getShoppingCart();
        }
      });
  }

  /**
   * Increment item quantity.
   *
   * @param item   Item to increment quantity
   */
  incrementItemQuantity(item) {
    var self = this;
    self.shoppingCartService.updateProductQuantityInShoppingCart(item.product.id,item.quantity + 1)
      .then(function (error) {
        if(!error) {
          self.getShoppingCart();
        }
      });
  }

  /**
   * Remove all item from shopping cart.
   */
  removeAllItems(){
    var self = this;
    if(confirm("Voulez-vous vider le panier?")) {
      self.shoppingCartService.removeAllItemsFromShoppingCart()
        .then(function (error) {
          if (!error) {
            self.getShoppingCart();
          }
        });
    }
  }

}
