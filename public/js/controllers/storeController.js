
angular.module('wctApp')
.controller('StoreController',
  ['$scope', '$location', '$window', '$stateParams',
    'ContextService', 'StoreService', 'CartService', '$http', '$state',
  
    function ($scope, $location, $window, $stateParams,
              ContextService, StoreService, CartService, $http, $state) {

      // console.log('STORE CONTROLLER', $stateParams);
      // an alt method with ui-bootstrap https://www.sitepoint.com/creating-stateful-modals-angularjs-angular-ui-router/
      // http://www.dwmkerr.com/the-only-angularjs-modal-service-youll-ever-need/

      $scope.view = {};
      $scope.view.ContextService = ContextService;
      $scope.view.StoreService = StoreService;
      $scope.view.CartService = CartService;
  
      $scope.view.stripe_publish_key = '';
      
      $scope.view.ContextService.STRIPE_PUBLISH_KEY()
      .then(function (data) {
        $scope.view.stripe_publish_key = data.data;
      });
            
      // Navigation helper
      $scope.isRouteActive = function(route) {
        return $location.path().indexOf(route) !== -1;
      };
      
      $scope.view.showCatalog = null;
      $scope.populateShowCatalog = function(){
        $scope.view.StoreService.getStoreShowCatalog()
        .then(function(data){
          $scope.view.showCatalog = data;
        })
      };
  
      $scope.view.productCatalog = null;
      $scope.populateProductCatalog = function(){
        $scope.view.StoreService.getStoreProductCatalog()
        .then(function(data){
          $scope.view.productCatalog = data;
        })
      };
      
      $scope.populateShowCatalog();
      $scope.populateProductCatalog();
      
}]);
