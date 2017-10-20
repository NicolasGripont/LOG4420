function productReady() {
  initProduct();
  $("#add-to-cart-form").click(function(event){ onAddToCartFormButtonClick(event.target); });  
}

function initProduct() {
  var idUrl = getUrlParameter('id');
  if(localStorage.getItem("products-list") === null || localStorage.getItem("products-list") === "") {
    console.log(typeof localStorage.getItem("products-list"));
    $.ajax({
      url: "./data/products.json",
      type: "GET",
      dataType : "json",
    })
    .done(function(json) {
      localStorage.setItem("products-list",JSON.stringify(json));
      showProductInfos(idUrl);       
    })
    .fail(function(xhr, status, errorThrown ) {
      showMessageError("Une erreur est survenue lors du chargement des produits...");
      console.log( "Error: " + errorThrown );
      console.log( "Status: " + status );
      console.dir( xhr );
      localStorage.setItem("products-list","");
    });    
  } else {    
    showProductInfos(idUrl);  
  }
}

function getUrlParameter(sParam) {
  var sPageURL = decodeURIComponent(window.location.search.substring(1)),
      sURLVariables = sPageURL.split('&'),
      sParameterName,
      i;

  for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');

      if (sParameterName[0] === sParam) {
          return sParameterName[1] === undefined ? true : sParameterName[1];
      }
  }
};

function showProductInfos(idUrl) {
  var json = JSON.parse(localStorage.getItem("products-list"));
  for(var i = 0; i < json.length; i++) {
    if(json[i].id == idUrl) {
      console.log("JE suis la");
      showProductHtml(json[i]);
      return;
    }
  }
  showMessageError("Page non trouvée!");
}

function showProductHtml(jsonProduct) {
  $("#product-name").html(jsonProduct.name);
  $("#product-image").attr("for", jsonProduct.name);
  $("#product-image").attr("src", "./assets/img/" + jsonProduct.image);
  $("#product-desc").html(jsonProduct.description);
  $("#product-features").append(createFeaturesHtml(jsonProduct.features));
  $("#product-price").html('Prix: <strong>' + jsonProduct.price.toString().replace(".",",") + '&thinsp;$</strong>');                  
}

function createFeaturesHtml(features) {
  var listFeatures = "";
  $.each(features, function(i, feature) {
    listFeatures += '<li>' + feature + '</li>';
  });
  return listFeatures;
}

function showMessageError(message) {
  $("main > article > *").remove();
  $("main > article").append(createMessageErrorHtml(message));
}

function createMessageErrorHtml(messageError) {
  return '<h1>' + messageError + '</h1>';
}



$(window).ready(function(){ productReady(); });