import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../products.service';
import { Product } from '../products.service';

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
   * @param route                   The active route.
   */
  constructor(private route: ActivatedRoute, private productsService : ProductsService) {
    this.product = null;
  }

  product : Product;

  /**
   * Occurs when the component is initialized.
   */
  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    this.getProduct(parseInt(productId));
  }

  getProduct(id: number): void {
    var self = this;
    this.productsService.getProduct(id)
      .then(function (product) {
        self.product = product;
      }).catch(function (error) {
        //TODO
    })
  }
}
