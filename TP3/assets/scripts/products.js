
function sortResults(json, prop, orderBy) {
  //TODO CHECK PARAM
    const sortedJson = json.sort(function(a, b) {
        if (orderBy === undefined || orderBy === "asc") {
          if($.type(a[prop]) === "string") {
            return (a[prop].toLowerCase() > b[prop].toLowerCase()) ? 1 : ((a[prop].toLowerCase() < b[prop].toLowerCase()) ? -1 : 0);
          }
          return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
        } else if(orderBy === "desc") {
          if($.type(a[prop]) === "string") {
            return (b[prop].toLowerCase() > a[prop].toLowerCase()) ? 1 : ((b[prop].toLowerCase() < a[prop].toLowerCase()) ? -1 : 0);
          }
          return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
        }
    });
    return sortedJson;
}

function createProductHtml(jsonProduct) {
  const produit = '<a href="product.html?id='+ jsonProduct["id"] +'">' +
            '  <section class="product">' +
            '    <h2>' + jsonProduct["name"] + '</h2>' +
            '    <img src="assets/img/' + jsonProduct["image"] + '" alt="' + jsonProduct["image"] + '"/>' +
            '    <p class="product-price">CDN$' + jsonProduct["price"] +'</p>' +
            '  </section>' +
            '</a>';
  return produit;
}

function showProductsList(products) {
  $("#products-list").empty();
  $.each(products, function(i, item) {
    $("#products-list").append(createProductHtml(item));
  });
  $("#products-number").html(products.length + " produits");
}


function initProducts() {
  $.ajax({
    url: "./data/products.json",
    type: "GET",
    dataType : "json",
  })
  .done(function(json) {
    var sortedJson = sortResults(json, "price", "asc");
    showProductsList(sortedJson);
    localStorage.setItem("products-list",JSON.stringify(sortedJson));
  })
  .fail(function( xhr, status, errorThrown ) {
    $("#products-list").html("Une erreur est survenue lors du chargement des produits...")
    console.log( "Error: " + errorThrown );
    console.log( "Status: " + status );
    console.dir( xhr );
    localStorage.setItem("products-list","");
  })
}

function getSelectedCategory() {
  var category = "all";
  $.each($("#product-categories button"), function(i, item) {
    if($(item).hasClass("selected")) {
      category = $(item).attr("category");
      return false;
    }
  });
  return category;
}

function getSelectedCriteria() {
  var criteria = "price";
  var orderBy = "asc"
  $.each($("#product-criteria button"), function(i, item) {
    if($(item).hasClass("selected")) {
      criteria = $(item).attr("criteria");
      orderBy = $(item).attr("orderBy");
      return false;
    }
  });
  return [criteria, orderBy];
}


function unselectButton(buttonGroup) {
  $.each(buttonGroup.children(), function(i, item) {
    $(item).removeClass("selected");
  });
}

function onProductCategoriesButtonClick(button) {
  unselectButton($(button).parent());
  $(button).addClass("selected");
  criteria = getSelectedCriteria();
  updateProductsList($(button).attr("category"),criteria[0],criteria[1]);
}

function onProductCriteriaButtonClick(button) {
  unselectButton($(button).parent());
  $(button).addClass("selected");
  updateProductsList(getSelectedCategory(),$(button).attr("criteria"),$(button).attr("orderBy"));
}

function updateProductsList(category, criteria, orderBy) {
  var json = JSON.parse(localStorage.getItem("products-list"));
    if(category !== "all") {
    json = $.grep(json,function (item,i){
      return item.category === category;
    });
  }
  sortedJson = sortResults(json,criteria, orderBy);
  showProductsList(sortedJson);
}



function productsReady() {
  initProducts();
  $("#product-categories button").click(function(event){ onProductCategoriesButtonClick(event.target); });
  $("#product-criteria button").click(function(){ onProductCriteriaButtonClick(event.target); });
}

$(window).ready(function(){ productsReady(); });



// $("#product-categories button").click(function{alert();});

















