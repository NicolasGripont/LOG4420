import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../products.service';
import { Product } from '../products.service';

/**
 * Defines the component responsible to manage the display of the products page.
 */
@Component({
  selector: 'products',
  templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit {

  /**
   * Products to display.
   */
  products : Product[];
  /**
   * Category selected.
   */
  category : string;
  /**
   * Sorting criteria selected.
   */
  criteria : string;

  /**
   * Initializes a new instance of the ProductComponent class.
   *
   * @param {ProductsService} The products service which manage products api call.
   */
  constructor(private productsService: ProductsService) {
    this.products = [];
    this.category = "all";
    this.criteria = "price-asc";
  }

  /**
   * Occurs when the component is initialized.
   */
  ngOnInit() {
    this.getProducts();
  }

  /**
   * Get product form productService and update view.
   */
  getProducts(): void {
    var self = this;
    this.productsService.getProducts(this.criteria,this.category)
      .then(function (products) {
        self.products = products;
      })
  }

  /**
   * Method calld on category button click. Update the products list with the corresponding category selected.
   *
   * @param event The event raised.
   */
  onCategoryButtonClick(event) {
    var buttonClicked = event.target;
    var buttonGroup = buttonClicked.parentElement;
    this.category = buttonClicked.getAttribute("category");
    this.getProducts();
    this.updateButtonGroup(buttonGroup,buttonClicked);
  }


  /**
   * Method calld on sorting criteria button click. Update the products list with the corresponding sorting criteria
   * selected.
   *
   * @param event The event raised.
   */
  onSortingCriteriaButtonClick(event) {
    var buttonClicked = event.target;
    var buttonGroup = buttonClicked.parentElement;
    this.criteria = buttonClicked.getAttribute("criteria");
    this.getProducts();
    this.updateButtonGroup(buttonGroup,buttonClicked);
  }


  /**
   * Update button group view.
   * @param buttonGroup    The button group to update.
   * @param buttonClicked  The current selected button.
   */
  updateButtonGroup(buttonGroup,buttonClicked) {
    for(var i = 0; i < buttonGroup.children.length; i++) {
      buttonGroup.children[i].classList.remove("selected");
    }
    buttonClicked.classList.add("selected");
  }

}
