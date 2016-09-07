
angular.module('MyApp')
    .controller('HeaderCtrl', HeaderCtrl);

HeaderCtrl.$inject = ['$scope', '$location', '$window', '$auth', 'ContextService'];

function HeaderCtrl($scope, $location, $window, $auth, ContextService) {
    var ctrl = this;
    ctrl.isActive = isActive;
    ctrl.isAuthenticated = isAuthenticated;
    ctrl.logout = logout;
    
    $scope.view = {};
    $scope.view.ContextService = ContextService;
    // ctrl.memberLogout = memberLogout; // not sure why this does not work
    
    // console.log('HEADER CONTROLLER LOADED')

    function isActive(viewLocation) {
        return viewLocation === $location.path();
    }

    function isAuthenticated() {
        return $auth.isAuthenticated();
    }

    function logout() {
        $auth.logout();
        delete $window.localStorage.user;
        $location.path('/');
    }

    $scope.memberLogout = function(){
        delete $window.localStorage.memberToken;
        $location.path('/members/signin');
    };
}
