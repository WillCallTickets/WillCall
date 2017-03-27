
angular.module('wctApp')
    .controller('BrochureController', BrochureController);

BrochureController.$inject = ['$scope', '$location', 'BrochureService'];

function BrochureController($scope, $location, BrochureService) {

    $scope.view = {};
    $scope.view.BrochureService = BrochureService;

    $scope.cancel = function(){
        BrochureService.setAddMode(false);
        $location.path('/admin/brochures');
    };

    $scope.setAddMode = function(active){
        BrochureService.setAddMode(active);
    };

    $scope.updateBrochure = function(form){
        $scope.view.errors = [];
        $scope.view.alerts = [];
        BrochureService.setAddMode(false);

        if(form.brochure) {
            var _brochure = angular.copy(form.brochure);
            BrochureService.updateBrochure(_brochure)
            .then(function (data) {
                form.$setPristine();
                form.$setUntouched();
                $scope.view.alerts.push('Your brochure has been updated successfully!');
            })
            .catch(function (err) {
                $scope.view.errors.push(err);
            });
        }
    };
}
