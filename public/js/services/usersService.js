
angular.module('MyApp')
  .service('UsersService', ['$http', '$q', '$stateParams', function($http, $q, $stateParams){

    var _self = this;
    this.listing = null;

  }]);