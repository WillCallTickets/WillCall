
angular.module('wctApp')
    .controller('OrdersController', OrdersController);

OrdersController.$inject = ['$scope', '$location', 'ContextService', 'OrdersService'];

function OrdersController($scope, $location, ContextService, OrdersService) {

    $scope.view = {};
    $scope.view.ContextService = ContextService;
    $scope.view.OrdersService = OrdersService;

    $scope.view.stripe_publish_key = '';
    $scope.view.ContextService.STRIPE_PUBLISH_KEY()
    .then(function (data) {
        $scope.view.stripe_publish_key = data.data;
    });
};