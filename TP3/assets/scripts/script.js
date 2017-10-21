"use strict";

function getNumberItems() {
  if(localStorage.getItem("numberItems") === null) {
    localStorage.setItem("numberItems",0);
    return 0;
  } 
  return localStorage.getItem("numberItems");
}

function initBadge() {
  const numberItems = getNumberItems();
  $(".shopping-cart > .count").html(numberItems);
  if(numberItems == 0) {
    $(".shopping-cart > .count").hide();
  } else {
    $(".shopping-cart > .count").show();
  }
}

function ready() {
  initBadge();
}

$(window).ready(function(){ ready(); });