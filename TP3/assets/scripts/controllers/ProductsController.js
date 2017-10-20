function ProductsController(model, view) {
    this._model = model;
    this._view = view;

    var _this = this;

    this._view.criteriaButtonClickedEvent.attach(function (sender, args) {
        _this.sortProducts(args.criteria, args.orderBy);
    });

    this._view.categoryButtonClickedEvent.attach(function (sender, args) {
        _this.filterProducts(args.category);
    });
}

ProductsController.prototype = {
    sortProducts : function (criteria, orderBy) {
        if(criteria && orderBy) {
            this._model.sort(criteria,orderBy);
        }
    },
    
    filterProducts : function (category) {
        if(category) {
            this._model.filter(category);
        }
    }
};

/* MAIN */

$(function () {
    var productsJSON = JSON.parse('[{"id": 1,"name": "Apple TV","price": 249.99,"image": "apple-tv.png","category": "computers"},{"id": 2,"name": "Canon EOS 5D Mark II","price": 2999.99,"image": "camera-1.png","category": "cameras"}]');
    var model = new ProductsModel(productsJSON),
        view = new ProductsView(model, {
            'productsList' : $('#products-list'), 
            'categoriesButtonsGroups' : $('#product-categories'), 
            'criteriaButtonsGroups' : $('#product-criteria'),
            'productsCount' : $('#products-count'),
        }),
        controller = new ProductsController(model, view);
    
    view.show();
})

