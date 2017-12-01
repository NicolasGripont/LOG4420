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
  category : string;
  criteria : string;

  constructor(private ProductsService: ProductsService) {
    this.products = [];
    this.category = "all";
    this.criteria = "price-asc";
  }


  ngOnInit() {
    this.getProducts();
  }


  getProducts(): void {
    var self = this;
    this.ProductsService.getProducts(this.criteria,this.category)
      .then(function (products) {
        self.products = products;
        console.log(products);
      }).catch(function (error) {
      })
  }

  onCategoryButtonClick(event) {
    var buttonClicked = event.target;
    var buttonGroup = buttonClicked.parentElement;
    this.category = buttonClicked.getAttribute("category");
    this.getProducts();
    this.updateButtonGroup(buttonGroup,buttonClicked);
  }

  onSortingCriteriaButtonClick(event) {
    var buttonClicked = event.target;
    var buttonGroup = buttonClicked.parentElement;
    this.criteria = buttonClicked.getAttribute("criteria");
    this.getProducts();
    this.updateButtonGroup(buttonGroup,buttonClicked);
  }

  updateButtonGroup(buttonGroup,buttonClicked) {
    for(var i = 0; i < buttonGroup.children.length; i++) {
      buttonGroup.children[i].classList.remove("selected");
    }
    buttonClicked.classList.add("selected");
  }

}
