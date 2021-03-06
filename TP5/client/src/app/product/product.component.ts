import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ProductsService, Product } from '../products.service';
import { ShoppingCartService, ShoppingCartItem } from '../shopping-cart.service';


/**
 * Defines the component responsible to manage the product page.
 */
@Component({
  selector: 'product',
  templateUrl: './product.component.html'
})
export class ProductComponent implements OnInit {

  /**
   * Initializes a new instance of the ProductComponent class.
   *
   * @param {Router} router       The router that provides the navigation and url manipulation capabilities.
   * @param {ActivatedRoute}      The active route.
   * @param {ProductsService}     The products service which manage products api call.
   * @param {ShoppingCartService} The shopping cart service which manage shopping cart api call.
   */
  constructor(private router : Router, private route: ActivatedRoute, private productsService : ProductsService, private shoppingCartService : ShoppingCartService) {
    this.product = null;
  }

  /**
   * The product quantity html input
   */
  @ViewChild('productQuantityElement') productQuantityElement: ElementRef;

  /**
   * The product added html dialog
   */
  @ViewChild('dialogElement') dialogElement: ElementRef;

  /**
   * The product to display
   */
  product : Product;

  /**
   * Occurs when the component is initialized.
   */
  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    this.getProduct(parseInt(productId));
  }

  /**
   * Gets and show product corresponding to the id
   * If product doesn't exist, redirect to error (**) page
   *
   * @param {number} id  Id of the product to get
   */
  getProduct(id: number): void {
    var self = this;
    this.productsService.getProduct(id)
      .then(function (product) {
        self.product = product;
        if(!product) {
          self.router.navigateByUrl("**");
        }
      })
  }

  /**
   * Add or update quantity of the current product to shopping-cart with the quantity in this.productQuantityElement
   *
   * @param event Event raised
   */
  onAddToCartFormSubmit(event) : void {
    var self = this;
    event.preventDefault();
    const quantity = parseInt(self.productQuantityElement.nativeElement.value);
    self.shoppingCartService.getShoppingCartItem(self.product.id)
      .then(function (shoppingCartItem) {
        if(shoppingCartItem) {
          console.log("updateProductQuantityInShoppingCart");
          self.updateProductQuantityInShoppingCart(self.product.id, quantity + shoppingCartItem.quantity);
        } else {
          console.log("addNewProductToShoppingCart");
          self.addNewProductToShoppingCart(self.product.id, quantity);
        }
      });
  }

  /**
   * Add current product to shopping-cart with the quantity in this.productQuantityElement
   *
   * @param event Event raised
   */
  addNewProductToShoppingCart(productId : number, quantity : number) : void {
    var self = this;
    self.shoppingCartService.addNewProductToShoppingCart(self.product.id, quantity)
      .then(function (error) {
        if (!error) {
          self.showProductAddedDialog();
        }
      });
  }

  /**
   * Update current product to shopping-cart with the quantity in this.productQuantityElement
   *
   * @param event Event raised
   */
  updateProductQuantityInShoppingCart(productId : number, quantity : number) : void {
   var self = this;
    self.shoppingCartService.updateProductQuantityInShoppingCart(self.product.id, quantity)
      .then(function (error) {
        if (!error) {
          self.showProductAddedDialog();
        }
      });
  }


  /**
   * Show during 5s this.dialogElement
   */
  showProductAddedDialog() : void {
    var self = this;
    self.dialogElement.nativeElement.hidden = false;
    setTimeout(function() {
      self.dialogElement.nativeElement.hidden = true;
    }, 5000);
  }
}
