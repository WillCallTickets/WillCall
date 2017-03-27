////////////////////////////////////////////////////////////
// Users Controller
//
// The users controller will handle user operations such as
// forgot-password, profile changes, etc
////////////////////////////////////////////////////////////

angular.module('wctApp')
.controller('UsersController',
  ['$scope', '$location', '$stateParams', 'UsersService', '$http',
  
    function ($scope, $location, $stateParams, UsersService, $http) {
        
    $scope.view = {};
    $scope.view.UsersService = UsersService;
}]);