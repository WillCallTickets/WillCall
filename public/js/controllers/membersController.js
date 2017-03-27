
angular.module('wctApp')
.controller('MembersController',
  [ '$scope', '$location', '$window', '$stateParams',
    'ContextService', 'MembersService',
    '$http', '$state',
    function ($scope, $location, $window, $stateParams, ContextService, MembersService, $http, $state) {

      // console.log('MEMBERS CONTROLLER', $stateParams);
      // console.log('MEMBERS LOCATION', $location);
      // console.log('MEMBERS STATE', $stateParams);
      // an alt method with ui-bootstrap https://www.sitepoint.com/creating-stateful-modals-angularjs-angular-ui-router/
      // http://www.dwmkerr.com/the-only-angularjs-modal-service-youll-ever-need/

      $scope.view = {};
      $scope.view.ContextService = ContextService;
      $scope.view.MembersService = MembersService;
      
      // Navigation helper
      $scope.isRouteActive = function(route) {
        return $location.path().indexOf(route) !== -1;
      };
      
      // Member Signin & Logout
      $scope.stripeSignin = function(){
        $http.get('/stripe/login').then(function(data){
        });
      };
      $scope.memberLogout = function(){
        $scope.view.ContextService.memberLogout();
        $scope.view.configList = null;
        $location.path('/members/signin');
      };
  
      $scope.view.currentConfigId = function(){
        return $stateParams['config_id']
      };
      $scope.view.currentShowId = function(){
        return $stateParams['show_id']
      };
      $scope.view.currentShowDateId = function(){
        return $stateParams['showdate_id']
      };
      $scope.view.currentShowTicketId = function(){
        return $stateParams['showticket_id']
      };
      $scope.view.currentProductId = function(){
        return $stateParams['product_id']
      };
      $scope.view.currentProductSkuId = function(){
        return $stateParams['productsku_id']
      };
      
      
      // Mode methods
      $scope.rowEdit = function(entityType, entity = null, parent = null){
        var idx = (entity) ? entity.id: 0;
        var parentIdx = (parent) ? parent.id: 0;
        
        if(entityType === 'config'){
          // console.log('config_id', idx)
          $state.go('members.configs.edit', {config_id: idx});
        } else if(entityType === 'show'){
          $state.go('members.shows.edit', {show_id: idx});
        } else if(entityType === 'showdate'){
          // console.log('showdate_id', idx, 'show_id', parentIdx)
          $state.go('members.shows.edit.showdates.edit', {showdate_id: idx, show_id: parentIdx});
        } else if(entityType === 'showticket'){
          // console.log('showdate_id', idx, 'show_id', parentIdx)
          $state.go('members.shows.edit.showdates.edit.showtickets.edit', {showticket_id: idx, showdate_id: parentIdx});
        } else if(entityType === 'showimage'){
          // console.log('showdate_id', idx, 'show_id', parentIdx)
          $state.go('members.shows.edit.showimages.edit', {showimage_id: idx, show_id, parentIdx});
        } else if(entityType === 'product'){
          $state.go('members.products.edit', {product_id: idx});
        } else if(entityType === 'productsku'){
          // console.log('productsku_id', idx, 'product_id', parentIdx)
          $state.go('members.products.edit.productskus.edit', {productsku_id: idx, product_id: parentIdx});
        }
      };
      
      // list assigns - be sure to init below
      $scope.view.configList = null;
      $scope.populateConfig = function(){
        $scope.view.MembersService.getConfigCollection()
        .then(function(data){
          $scope.view.configList = data;
        });
      };
  
      $scope.view.eventQs = null;
      $scope.populateEventQs = function(){
        $scope.view.MembersService.getMemberEvents()
        .then(function(data){
          $scope.view.eventQs = data;
        })
      };
  
      $scope.view.showList = null;
      $scope.populateShowList = function(){
        $scope.view.MembersService.getMemberShowListing()
        .then(function(data){
          $scope.view.showList = data;
        })
      };
  
      $scope.view.productList = null;
      $scope.populateProductList = function(){
        $scope.view.MembersService.getMemberProductListing()
        .then(function(data){
          $scope.view.productList = data;
        })
      };
      
      
      // init methods
      $scope.populateConfig();
      $scope.populateShowList();
      $scope.populateEventQs();
      $scope.populateProductList();
}]);
