
angular.module('MyApp')
  .service('StoreService', ['$http', '$q', '$stateParams', 'ContextService',
    'Show', 'ShowDate', 'ShowTicket', 'Product', 'ProductSku',
    
    function($http, $q, $stateParams,
             ContextService, Show, ShowDate, ShowTicket, Product, ProductSku){

      var _self = this;
      
      // catalog uses showdates as root
      this.getStoreShowCatalog = function(){
        return $http.get('/api/store/shows/catalog')
        .then(function (data) {
          var showData = data.data;
          
          // build catalog - for shows, we want to base on showdates
          var dateModels = ShowDate.buildShowDateCollection(showData.showdates, showData.showtickets);
          
          // add show to showdate
          var dms = dateModels.reduce(function(prev, cur){
            if(cur.showtickets.length > 0) {
              var show = showData.shows.filter(e => e.id === cur.show_id);
              cur.parentShow(new Show(show[0]));
              prev.push(cur);
            }
            return prev;
          },[]);
          
          // now loop thru tickets and to their existing show dates - add a ref to the parentshow
          var rec = dms.map(function(e){
            e.showtickets.forEach(function(tix){
              var showMatches = showData.shows.filter(e => e.id === tix._parentShowDate.show_id);
              var foundShow = showMatches[0];
              tix._parentShowDate._parentShow = foundShow;
            });
            return e;
          });
          
          return rec;
        });
      };
  
      this.getStoreProductCatalog = function(){
        return $http.get('/api/store/products/catalog')
        .then(function (data) {
          
          var productData = data.data;
          var productModels = Product.buildProductCollection(
            productData.products,
            ProductSku.buildProductSkuCollection(productData.productskus));
          
          // reduce to remove those without skus
          return productModels.filter(function(model){
            return model.productskus.length > 0;
          });
        });
      };
      
  }]);