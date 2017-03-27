////////////////////////////////////////////////////////////
// User Service
//
// TODO user related services - forgot password, profile, etc
////////////////////////////////////////////////////////////

angular.module('wctApp')
  .service('UsersService',
      ['$http', '$q', '$stateParams',
      
      function($http, $q, $stateParams){

    var _self = this;
    this.listing = null;

  }]);