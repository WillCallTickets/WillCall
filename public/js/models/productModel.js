angular.module('MyApp').factory('Product',
  ['$http', '$q', 'moment', function($http, $q, moment){
  
  function Product(row, skuModels = null){
    this.id = row.id;
    this.created_at = row.created_at;
    this.updated_at = row.updated_at;
    this.member_id = row.member_id;
    this.division = row.division;
    this.category = row.category;
    this.name = row.name;
    this.description = row.description;
    this.images = row.images;
    this.deliveryoptions = row.deliveryoptions;
    this.active = row.active;
    this.status = row.status;
    this.productskus = [];
    
    if(skuModels && skuModels.length > 0){
      this.productskus = skuModels.map(function(e){
        e.parentProduct(row);
        return e;
      });
    }
  };
    
  Product.prototype = {
    
    // only issue a warning if it will cause a show not to display tickets
    skuWarningIfEmpty: function(){
      return this.productskus.filter(function (itm) {
        return itm.active && itm.available() > 0 && itm.price > 0;
      });
    }
  };
  
  
  ////////////////////////////////////////////
  // STATIC methods
  ////////////////////////////////////////////
  
  Product.processForm = function(form, input, currentProduct){
  
    var deferred = $q.defer();
      
    var errors = [];
      
    $http.post('/api/products', {
      input: input,
      current: currentProduct
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
    
  
  // Convert to Show Objects
  Product.buildProductCollection = function(productRows, skuModels) {
    return productRows.map(function (product) {
      var matches = skuModels.filter(e => e.product_id === product.id);
      if (matches.length > 1) {
        matches.sort('name');//(a, b) => a.name > b.name);
      }
      
      return new Product(product, matches);
    });
  };
  
  return Product;
}]);
