
angular.module('MyApp')
  .service('ContextService', ['$http', '$q', '$stateParams', '$rootScope', '$window', 'jwtHelper',
    'Config', 'Show', 'ShowDate', 'ShowTicket', 'Product', 'ProductSku',
    function($http, $q, $stateParams, $rootScope, $window, jwtHelper,
             Config, Show, ShowDate, ShowTicket, Product, ProductSku){

      var _self = this;
            
      this.STRIPE_PUBLISH_KEY = function(){
        return $http.get('/api/envkey/STRIPE_PUBLISH');
      }
  
      ////////////////////////////////////////////////
      // PRODUCT Funcs
      ////////////////////////////////////////////////
      this.currentProduct = null;
      this.setCurrentProduct = function(idx) {
        if(idx && idx !== '0'){
          return $http.get('/api/products/' + idx)
          .then(function (data) {
            var memberProductData = data.data;
            var products = Product.buildProductCollection(
              memberProductData.products,
              ProductSku.buildProductSkuCollection(memberProductData.productskus));
            
            this.currentProduct = (products.length) ? products[0] : null;
            
            return this.currentProduct;
          });
        } else {
          return this.currentProduct = null;
        }
      };
  
      ////////////////////////////////////////////////
      // PRODUCTSKU Funcs
      ////////////////////////////////////////////////
      this.currentProductSku = null;
      this.setCurrentProductSku = function(idx) {
        if(idx && idx !== '0'){
          return $http.get('/api/productskus/' + idx)
          .then(function (data) {
            var memberProductData = data.data;
            var productskus = ProductSku.buildProductSkuCollection(
              memberProductData.productskus);
            
            this.currentProductSku = (productskus.length) ? productskus[0] : null;
            if(this.currentProductSku){
              this.currentProductSku.parentProduct((memberProductData.products.length) ? memberProductData.products[0] : null);
            }
            
            return this.currentProductSku;
          });
        } else {
          return this.currentProductSku = null;
        }
      };
  
      ////////////////////////////////////////////////
      // CONFIG Funcs
      ////////////////////////////////////////////////
      this.currentConfig = null;
      this.setCurrentConfig = function(idx) {
        if(idx && idx !== '0'){
          return $http.get('/api/configs/' + idx)
          .then(function (data) {
            var configs = Config.buildConfigFromRow(data.data);
            this.currentConfig = (configs.length) ? configs[0] : null;
            
            return this.currentConfig;
          });
        } else {
          return this.currentConfig = null;
        }
      };
      
      ////////////////////////////////////////////////
      // SHOW Funcs
      ////////////////////////////////////////////////
      this.currentShow = null;
      this.setCurrentShow = function(idx) {
        if(idx && idx !== '0'){
          return $http.get('/api/shows/' + idx)
          .then(function (data) {
            var memberShowData = data.data;
            var shows = Show.buildShowCollection(
              memberShowData.shows,
              ShowDate.buildShowDateCollection(memberShowData.showdates, memberShowData.showtickets));
            
            this.currentShow = (shows.length) ? shows[0] : null;
            
            return this.currentShow;
          });
        } else {
          return this.currentShow = null;
        }
      };
  
      ////////////////////////////////////////////////
      // SHOWDATE Funcs
      ////////////////////////////////////////////////
      this.currentShowDate = null;
      this.setCurrentShowDate = function(idx) {
        // console.log('IDX',idx)
        if(idx && idx !== '0'){
          return $http.get('/api/showdates/' + idx)
          .then(function (data) {
            var memberShowData = data.data;
            var showdates = ShowDate.buildShowDateCollection(
              memberShowData.showdates, memberShowData.showtickets);
            
            this.currentShowDate = (showdates.length) ? showdates[0] : null;
            if(this.currentShowDate){
              this.currentShowDate.parentShow((memberShowData.shows.length) ? memberShowData.shows[0] : null);
            }
            
            return this.currentShowDate;
          });
        } else {
          return this.currentShowDate = null;
        }
      };
  
      ////////////////////////////////////////////////
      // SHOWTICKET Funcs
      ////////////////////////////////////////////////
      this.currentShowTicket = null;
      this.setCurrentShowTicket = function(idx) {
        if(idx && idx !== '0'){
          return $http.get('/api/showtickets/' + idx)
          .then(function (data) {
            // !!! api call returns response data - so get data at data.data
            var memberShowData = data.data;
            var showtickets = ShowTicket.buildShowTicketCollection(
              memberShowData.showtickets);
            this.currentShowTicket = (showtickets.length) ? showtickets[0] : null;
            if(this.currentShowTicket){
              var _showDate = (memberShowData.showdates.length) ? memberShowData.showdates[0] : null;
              if(_showDate){
                _showDate.parentRow = (memberShowData.shows.length) ? memberShowData.shows[0] : null;
                this.currentShowTicket.parentShowDate(_showDate);
              }
            }
            
            return this.currentShowTicket;
          });
        } else {
          return this.currentShowTicket = null;
        }
      };
  
      ////////////////////////////////////////////////
      // TODO SHOWIMAGE Funcs
      ////////////////////////////////////////////////
      // this.currentShowImage = null;
      // this.setCurrentShowImage = function(idx) {
      //   // console.log('IDX',idx)
      //   if(idx && idx !== '0'){
      //     return $http.get('/api/showimages/' + idx)
      //     .then(function (data) {
      //       this.currentShowImage = data.data;
      //
      //       // TODO add parent show to image?
      //
      //       return this.currentShowImage;
      //     });
      //   } else {
      //     return this.currentShowImage = null;
      //   }
      // };
      
      ////////////////////////////////////////////////
      // MEMBER Funcs
      ////////////////////////////////////////////////
      this.__memberCurrent = function() {
        var _token = $window.localStorage.memberToken;
        if (_token && (!jwtHelper.isTokenExpired(_token))) {
          var _decoded = jwtHelper.decodeToken(_token);
          return _decoded.member;
        }
        return false;
      };
      this.currentMember = this.__memberCurrent();
            
      this.memberLogout = function(){
        delete $window.localStorage.memberToken;
        this.currentMember = this.__memberCurrent();
      }
      
  }]);
      