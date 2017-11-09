
class Utils{
  constructor(){

  }

  sortJSON(products, criteria, orderBy) {
    products = products.sort(function(a, b) {
      if (orderBy === undefined || orderBy === "asc") {
        if(typeof(a[criteria]) === "string") {
          return (a[criteria].toLowerCase() > b[criteria].toLowerCase()) ? 1 : ((a[criteria].toLowerCase() < b[criteria].toLowerCase()) ? -1 : 0);
        }
        return (a[criteria] > b[criteria]) ? 1 : ((a[criteria] < b[criteria]) ? -1 : 0);
      } else if(orderBy === "dsc") {
        if(typeof(a[criteria]) === "string") {
          return (b[criteria].toLowerCase() > a[criteria].toLowerCase()) ? 1 : ((b[criteria].toLowerCase() < a[criteria].toLowerCase()) ? -1 : 0);
        }
        return (b[criteria] > a[criteria]) ? 1 : ((b[criteria] < a[criteria]) ? -1 : 0);
      }
    });
    return products;
  }

}


module.exports = Utils;
