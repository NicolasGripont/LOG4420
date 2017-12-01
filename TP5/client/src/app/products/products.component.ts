import { Component } from '@angular/core';
import { ProductsService } from '../products.service';
import { Product } from '../products.service';


/**
 * Defines the component responsible to manage the display of the products page.
 */
@Component({
  selector: 'products',
  templateUrl: './products.component.html'
})
export class ProductsComponent {

  products : Product[];

  constructor(private ProductsService: ProductsService) {
  }


  ngOnInit() {
    this.getProducts();
  }


  getProducts(): void {
    var self = this;
    this.ProductsService.getProducts("price-asc","all")
      .then(function (products) {
        self.products = products;
      }).catch(function (error) {
      })
  }


}
