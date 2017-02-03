
angular.module('MyApp')
  .service('MembersService', ['$http', '$q', '$stateParams', 'ContextService',
    'Show', 'ShowDate', 'ShowTicket', 'Product', 'ProductSku',
    
    function($http, $q, $stateParams,
             ContextService, Show, ShowDate, ShowTicket, Product, ProductSku){

      var _self = this;
      this.listing = null;
      
      
      this.getMemberEvents = function(){
          if (ContextService.currentMember) {
            return $http.get('/api/members/' + ContextService.currentMember.id + '/events')
            .then(function (data) {
              return data.data;
            });
          } else {
            return new Promise(function(resolve, reject){
              return resolve([]);
            });
          }
      };
        
      this.getMemberProductListing = function(){
        if (ContextService.currentMember) {
          return $http.get('/api/members/' + ContextService.currentMember.id + '/products')
          .then(function (data) {
            var memberProductData = data.data;
            return Product.buildProductCollection(
              memberProductData.products,
              ProductSku.buildProductSkuCollection(memberProductData.productskus));
          });
        } else {
          return new Promise(function(resolve, reject){
            return resolve([]);
          });
        }
      };
        
      this.getMemberShowListing = function(){
          if (ContextService.currentMember) {
            return $http.get('/api/members/' + ContextService.currentMember.id + '/shows')
            .then(function (data) {
              // console.log('DATA RETURNED AT SERVICE',data.data)
              var memberShowData = data.data;
              return Show.buildShowCollection(
                memberShowData.shows,
                ShowDate.buildShowDateCollection(memberShowData.showdates, memberShowData.showtickets));
            });
          } else {
            return new Promise(function(resolve, reject){
              return resolve([]);
            });
          }
      };
    
      
      this.getConfigCollection = function(){
          if(ContextService.currentMember) {
            return $http.get('/api/members/' + ContextService.currentMember.id + '/configs')
            .then(function(data){
              return data.data;
            });
          } else {
            return new Promise(function(resolve, reject){
              return resolve([]);
            });
          }
      };
             
  }]);