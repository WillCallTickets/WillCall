////////////////////////////////////////////////////////////
// Member Service
//
// Services for members area - setting up a member's store
////////////////////////////////////////////////////////////

angular.module('wctApp')
  .service('MembersService',
    [ '$http', '$q', '$stateParams',
      'ContextService',
      'Show', 'ShowDate', 'ShowTicket',
      'Product', 'ProductSku',
    
    function($http, $q, $stateParams,
             ContextService,
             Show, ShowDate, ShowTicket,
             Product, ProductSku){

      var _self = this;
      this.listing = null;
      
      // retrieve members event logs
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
        
      // retrieve product listing for current member
      this.getMemberProductListing = function(){
        if (ContextService.currentMember) {
          return $http.get('/api/members/' + ContextService.currentMember.id + '/products')
          .then(function (data) {
            var memberProductData = data.data;
  
            // construct the collection per the model
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
  
      // retrieve show listing for current member
      this.getMemberShowListing = function(){
          if (ContextService.currentMember) {
            return $http.get('/api/members/' + ContextService.currentMember.id + '/shows')
            .then(function (data) {
              var memberShowData = data.data;
              
              // construct the collection per the model
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
  
      // retrieve config var listing for current member
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