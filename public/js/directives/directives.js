
angular.module('MyApp')

.directive('toggle', function(){
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      if (attrs.toggle == "tooltip") {
        $(element).tooltip();
      }
    }
  }
})
.directive('wctBrochureDisplay', ['BrochureService', function(BrochureService) {
  return {
    restrict: 'E',
    scope: {
      item: '='
    },
    templateUrl: 'partials/brochurePanel.html',
    controller: ['$scope','$sce', function ($scope, $sce) {
      $scope.view = {};
      $scope.view.BrochureService = BrochureService;
      $scope.view.abstract = $sce.trustAsHtml($scope.item.abstract);
    }]
  }
}]);


angular.module('MyApp')
.directive('wctAddBrochure', ['BrochureService', function(BrochureService){
  return {
    restrict: 'E',
    scope: {
    },
    templateUrl: 'partials/admin/brochures/add.html',
    controller: function($scope) {
      $scope.view = {};
      $scope.view.errors = [];

      $scope.cancel = function(){
        $scope.view.errors = [];
        BrochureService.setAddMode(false);
      };

      $scope.submitBrochure = function(form){
        $scope.view.errors = [];
        if(form.brochure){
          var _brochure = angular.copy(form.brochure);
          BrochureService.addBrochure(_brochure)
          .then(function(data){

            form.brochure = {
              title: '',
              abstract: '',
              description: ''
            };

            form.$setPristine();
            form.$setUntouched();
            BrochureService.setAddMode(false);
          })
          .catch(function(err){
            $scope.view.errors.push(err);
          });
        }
      }
    }
  }
}]);