"use strict";

var ProductsModel = function (json) {
  this.allProductsJSON = json;
  this.currentProductsJSON = json;
  this.currentProductsChangedEvent = new Event(this);
  this.criteria = "price";
  this.orderBy = "asc";
  this.category = "all";
};

ProductsModel.prototype = {
  resetProducts : function(json) {
    this.allProductsJSON = json;
    this.filterAndSort(this.category,this.criteria,this.orderBy);
  },

  getProducts : function() {
    return this.currentProductsJSON;
  },

  sort : function(criteria, orderBy) {
    if(criteria, orderBy) {
      this.criteria = criteria;
      this.orderBy = orderBy;
      this.filterAndSort(this.category,criteria,orderBy);
    }
  },

  filter : function(category) {
    if(category) {
      this.category = category;
      this.filterAndSort(category,this.criteria,this.orderBy);
    }    
  },   

  filterAndSort : function(category, criteria, orderBy) {
    this.currentProductsJSON = this.allProductsJSON;
    if(this.currentProductsJSON) {
      if(category !== "all") {
        this.currentProductsJSON = $.grep(this.currentProductsJSON,function (item,i){
          return item.category === category;
        });
      }
      this.currentProductsJSON = this.currentProductsJSON.sort(function(a, b) {
        if (orderBy === undefined || orderBy === "asc") {
          if($.type(a[criteria]) === "string") {
            return (a[criteria].toLowerCase() > b[criteria].toLowerCase()) ? 1 : ((a[criteria].toLowerCase() < b[criteria].toLowerCase()) ? -1 : 0);
          }
          return (a[criteria] > b[criteria]) ? 1 : ((a[criteria] < b[criteria]) ? -1 : 0);
        } else if(orderBy === "desc") {
          if($.type(a[criteria]) === "string") {
            return (b[criteria].toLowerCase() > a[criteria].toLowerCase()) ? 1 : ((b[criteria].toLowerCase() < a[criteria].toLowerCase()) ? -1 : 0);
          }
          return (b[criteria] > a[criteria]) ? 1 : ((b[criteria] < a[criteria]) ? -1 : 0);
        }
      });
      this.currentProductsChangedEvent.notify({products : this.currentProductsJSON })
    }
  }
};
