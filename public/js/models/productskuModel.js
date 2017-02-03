angular.module('MyApp')
.factory('ProductSku', ['$http', '$q', function($http, $q){
  
  function ProductSku(row, parentProduct = null){
    this.id = row.id;
    this.created_at = row.created_at;
    this.updated_at = row.updated_at;
    this.product_id = row.product_id;
    this.name = row.name;
    this.attribs = row.attribs;
    this.price = row.price;
    this.active = row.active;
    this.status = row.status;
    this.maxperorder = row.maxperorder;
    this.allotted = row.allotted;
    this.sold = row.sold;
    this.refunded = row.refunded;
    
    this._parentProduct = parentProduct;
  }
  
  ProductSku.prototype = {
    parentProduct(row){
      this._parentProduct = row;
    }
  };
  
  ProductSku.prototype.available = function(){
    return (this.allotted - this.sold + this.refunded);
  };
  ProductSku.prototype.priceWarning = function() {
    return !this.price || this.price.toString().trim().length === 0 || this.price == 0;
  };
  ProductSku.prototype.allotmentWarning = function() {
    return !this.allotted || this.allotted.toString().trim().length === 0 || this.allotted == 0;
  };
  ProductSku.prototype.availableWarning = function() {
    return !this.allotmentWarning() && this.available() <= 0;
  };
  ProductSku.prototype.activeWarning = function() {
    return !this.active;
  };
  ProductSku.prototype.displayWarning = function(){
    return this.priceWarning() || this.allotmentWarning() || this.availableWarning() || this.activeWarning();
  };
  
  ////////////////////////////////////////////
  // STATIC methods
  ////////////////////////////////////////////
  
  ProductSku.processForm = function(form, input, currentProductSku, currentProduct){
    
    var deferred = $q.defer();
                    
    var errors = [];
  
    input.product_id = (currentProductSku) ?
      currentProductSku.product_id : (currentProduct) ? currentProduct.id : -1;
      
    $http.post('/api/productskus', {
      input: input,
      current: currentProductSku
    })
    .then(function(data){
      var returnData = data.data;
      deferred.resolve(returnData);
    })
    .catch(function(err){
      //convert err to array and return
      errors.push(err.data);
      deferred.reject(errors);
    })
    
    
    return deferred.promise;
  };
  
  // Convert to ShowTicket Objects
  ProductSku.buildProductSkuCollection = function(productskuRows) {
    return productskuRows.map(function (productsku) {
      return new ProductSku(productsku);
    });
  };
  
  return ProductSku;
}]);

