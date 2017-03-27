
angular.module('wctApp')
.controller('UsersController',
  ['$scope', '$location', '$stateParams', 'UsersService', '$http',
  
    function ($scope, $location, $stateParams, UsersService, $http) {
        
    $scope.view = {};
    $scope.view.UsersService = UsersService;
}]);