
var app = angular.module('MyApp', ['ui.router', 'satellizer','angular-jwt',
  'angularMoment', 'ui.bootstrap.datetimepicker', 'ui.dateTimeInput'])
.config(function($stateProvider, $urlRouterProvider, $locationProvider,
                 $httpProvider, $authProvider) {
  
  
  $locationProvider.html5Mode(true);
  $httpProvider.interceptors.push('jwtMemberInterceptor');
  $urlRouterProvider.otherwise('/');
  
  
  $stateProvider
  .state('home', {
    url: '/',
    templateUrl: 'partials/home.html',
    controller: 'BrochureController'
  })
  .state('users', {
    abstract: true,
    url: '/users',
    templateUrl: 'partials/users/index.html'
  })
  .state('users_edit', {
    url: '/admin/users/:user_id',
    templateUrl: 'partials/admin/users/edit.html'
  })
  .state('store', {
    abstract: true,
    url: '/store',
    views: {
      '@': {
        templateUrl: 'partials/store/index.html',
        controller: 'StoreController',
      },
      'navigation@store': {
        templateUrl: 'partials/store/navigation.html',
      },
      'cart@store': {
        templateUrl: 'partials/store/cart.html',
      }
    }
  })
  .state('store.shows', {
    url: '/shows',
    templateUrl: 'partials/store/shows.html',
  })
  .state('store.products', {
    url: '/products',
    templateUrl: 'partials/store/products.html',
  })
  .state('store.checkout', {
    url: '/checkout',
    views: {
      '': {
        templateUrl: 'partials/store/checkout.html',
        resolve: { storeCart: storeCart }
      },
      'cart@store': {
        templateUrl: 'partials/store/upsell.html',
        }
      }
    }
  )
  .state('store.checkout.success', {
    url: '/success',
    views: {
      '@': {
        templateUrl: 'partials/store/success.html',
        resolve: { clearCart: clearCart }
      },
    }
  })
    
    
    
    
    
    
    
  /*
    MEMBERS AREA
   */
  .state('members', {
    abstract: true,
    url: '/members',
    views: {
      '@': {
        templateUrl: 'partials/members/index.html',
        controller: 'MembersController',
      },
      'navigation@members': {
        templateUrl: 'partials/members/navigation.html',
      }
    }
  })
  .state('members.signin', {
    url: '/signin',
    templateUrl: 'partials/members/signin.html',
  })
  .state('members.profile', {
    url: '/profile',
    templateUrl: 'partials/members/profile.html',
  })
  .state('members.eventqs', {
    url: '/eventqs',
    templateUrl: 'partials/members/eventqs.html',
  })
  ///////////////////////////////
  // Member Configs
  ///////////////////////////////
  .state('members.configs', {
    url: '/configs',
    templateUrl: 'partials/members/configs.html',
  })
  .state("members.configs.edit", {
    url: '/:config_id',
    views:{
      "modal@members": {
        templateUrl: "partials/members/configs.edit.html",
        controller: 'MembersFormsController',
        resolve: { setCurrentConfig: setCurrentConfig }
      }
    },
    onEnter: ["$state", function($state) {
      $(document).on("click", ".Modal-box, .Modal-box *", function(e) {
        e.stopPropagation();
      });
    }],
  })
  ///////////////////////////////
  // Member Shows
  ///////////////////////////////
  .state('members.shows', {
    url: '/shows',
    templateUrl: 'partials/members/shows.html',
  })
  .state("members.shows.edit", {
    url: '/:show_id',
    views:{
      "modal@members": {
        templateUrl: "partials/members/shows.edit.html",
        controller: 'MembersFormsController',
        resolve: { setCurrentShow: setCurrentShow }
      }
    },
    onEnter: ["$state", function($state) {
      $(document).on("click", ".Modal-box, .Modal-box *", function(e) {
        e.stopPropagation();
      });
    }],
  })
  ///////////////////////////////
  // Member ShowDates
  ///////////////////////////////
  .state("members.shows.edit.showdates", {
    abstract: true
  })
  .state("members.shows.edit.showdates.edit", {
    url: '/showdates/:showdate_id',
    views:{
      "modal@members": {
        templateUrl: "partials/members/showdates.edit.html",
        controller: 'MembersFormsController',
        resolve: { setCurrentShowDate: setCurrentShowDate }
      }
    },
    onEnter: ["$state", function($state) {
      $(document).on("click", ".Modal-box, .Modal-box *", function(e) {
        e.stopPropagation();
      });
    }],
  })
  ///////////////////////////////
  // Member ShowTickets
  ///////////////////////////////
  .state("members.shows.edit.showdates.edit.showtickets", {
    abstract: true
  })
  .state("members.shows.edit.showdates.edit.showtickets.edit", {
    url: '/showtickets/:showticket_id',
    views:{
      "modal@members": {
        templateUrl: "partials/members/showtickets.edit.html",
        controller: 'MembersFormsController',
        resolve: { setCurrentShowTicket: setCurrentShowTicket }
      }
    },
    onEnter: ["$state", function($state) {
      $(document).on("click", ".Modal-box, .Modal-box *", function(e) {
        e.stopPropagation();
      });
    }],
  })
  ///////////////////////////////
  // Member ShowImages
  ///////////////////////////////
  .state("members.shows.edit.showimages", {
    abstract: true
  })
  .state("members.shows.edit.showimages.edit", {
    url: '/:showimage_id',
    views:{
      "modal@members": {
        templateUrl: "partials/members/showimages.edit.html",
        controller: 'MembersFormsController',
        resolve: { setCurrentShowImage: setCurrentShowImage }
      }
    },
    onEnter: ["$state", function($state) {
      $(document).on("click", ".Modal-box, .Modal-box *", function(e) {
        e.stopPropagation();
      });
    }],
  })
  ///////////////////////////////
  // Member Products
  ///////////////////////////////
  .state('members.products', {
    url: '/products',
    templateUrl: 'partials/members/products.html',
  })
  .state("members.products.edit", {
    url: '/:product_id',
    views:{
      "modal@members": {
        templateUrl: "partials/members/products.edit.html",
        controller: 'MembersFormsController',
        resolve: { setCurrentProduct: setCurrentProduct }
      }
    },
    onEnter: ["$state", function($state) {
      $(document).on("click", ".Modal-box, .Modal-box *", function(e) {
        e.stopPropagation();
      });
    }],
  })
  ///////////////////////////////
  // Member ProductSkus
  ///////////////////////////////
  .state("members.products.edit.productskus", {
    abstract: true
  })
  .state("members.products.edit.productskus.edit", {
    url: '/productskus/:productsku_id',
    views:{
      "modal@members": {
        templateUrl: "partials/members/productskus.edit.html",
        controller: 'MembersFormsController',
        resolve: { setCurrentProductSku: setCurrentProductSku }
      }
    },
    onEnter: ["$state", function($state) {
      $(document).on("click", ".Modal-box, .Modal-box *", function(e) {
        e.stopPropagation();
      });
    }],
  })
  ///////////////////////////////
  // Member Dashboard
  ///////////////////////////////
  .state('members.dashboard', {
    url: '/dashboard',
    templateUrl: 'partials/members/dashboard.html',
  })
  ///////////////////////////////
  // Member Errors
  ///////////////////////////////
  .state('members.error', {
    url: '/error',
    templateUrl: 'partials/members/error.html',
  })
/*
  END MEMBERS AREA
 */

  .state('admin', {
    url: '/admin',
    templateUrl: 'partials/admin/index.html'
  })

  .state('brochures', {
    url: '/admin/brochures',
    templateUrl: 'partials/admin/brochures/listing.html',
    controller: 'BrochureController'
  })
  .state('brochures_edit', {
    url: '/admin/brochures/:brochure_id',
    templateUrl: 'partials/admin/brochures/edit.html',
    controller: 'BrochureController'
  })
  .state('orders_verify', {
    url: '/orders/verify',
    templateUrl: 'partials/orders/verify.html',
    controller: 'OrdersController'
  })
  .state('orders_charge', {
    url: '/orders/charge',
    templateUrl: 'partials/orders/charge.html',
    controller: 'OrdersController'
  })
  .state('orders_success', {
    url: '/orders/success',
    templateUrl: 'partials/orders/success.html',
    controller: 'OrdersController'
  })

  // .state('account', {
  //   url: '/account',
  //   templateUrl: 'partials/profile.html',
  //   controller: 'ProfileCtrl',
  //   resolve: { loginRequired: loginRequired }
  // })
  // .state('forgot', {
  //   url: '/forgot',
  //   templateUrl: 'partials/forgot.html',
  //   controller: 'ForgotCtrl',
  //   resolve: { skipIfAuthenticated: skipIfAuthenticated }
  // })
  // .state('resetToken', {
  //   url: '/reset/:token',
  //   templateUrl: 'partials/reset.html',
  //   controller: 'ResetCtrl',
  //   resolve: { skipIfAuthenticated: skipIfAuthenticated }
  // })
  // .state('api', {
  //   url: '/api',
  //   templateUrl: 'partials/api.html',
  //   controller: 'ApiCtrl'
  //   // , resolve: { skipIfAuthenticated: skipIfAuthenticated }
  // });
  
  
  function storeCart($stateParams, CartService){
    // console.log('storing cart')
    
    return CartService.saveCartToDb()
    .then(function(data){
      // TODO handle success and failure
      // console.log('RETURN DATA', data)
    });
  };
  
  function clearCart(){
    // console.log('clearing cart')
    localStorage.removeItem('wctCartId');
    localStorage.removeItem('wctCart');
  };
  
  

  // set the current config based on state params
  function setCurrentConfig($stateParams, ContextService){
    // console.log('setting')
    if(!$stateParams || (!$stateParams.config_id) || $stateParams.config_id === '0') {
      return null;
    }
    return ContextService.setCurrentConfig($stateParams.config_id)
    .then(function(data){
      return ContextService.currentConfig = data;
    });
  };
  
  // set the current product based on state params
  function setCurrentProduct($stateParams, ContextService){
    if(!$stateParams || (!$stateParams.product_id) || $stateParams.product_id === '0') {
      return null;
    }
    return ContextService.setCurrentProduct($stateParams.product_id)
    .then(function(data){
      return ContextService.currentProduct = data;
    });
  };
  
  // set the current productsku based on state params
  function setCurrentProductSku($stateParams, ContextService){
    // console.log('STATE PARAMS', $stateParams)
    if(!$stateParams || (!$stateParams.productsku_id) || $stateParams.productsku_id === '0') {
      return null;
    }
    return ContextService.setCurrentProductSku($stateParams.productsku_id)
    .then(function(data){
      return ContextService.currentProductSku = data;
    });
  };
  
  // set the current show based on state params
  function setCurrentShow($stateParams, ContextService){
    if(!$stateParams || (!$stateParams.show_id) || $stateParams.show_id === '0') {
      return null;
    }
    return ContextService.setCurrentShow($stateParams.show_id)
    .then(function(data){
      return ContextService.currentShow = data;
    });
  };
  
  // set the current showdate based on state params
  function setCurrentShowDate($stateParams, ContextService){
    if(!$stateParams || (!$stateParams.showdate_id) || $stateParams.showdate_id === '0') {
      return null;
    }
    return ContextService.setCurrentShowDate($stateParams.showdate_id)
    .then(function(data){
      return ContextService.currentShowDate = data;
    });
  };
  
  // set the current showticket based on state params
  function setCurrentShowTicket($stateParams, ContextService){
    if(!$stateParams || (!$stateParams.showticket_id) || $stateParams.showticket_id === '0') {
      return null;
    }
    return ContextService.setCurrentShowTicket($stateParams.showticket_id)
    .then(function(data){
      return ContextService.currentShowTicket = data;
    });
  };
  
  // set the current showimage based on state params
  function setCurrentShowImage($stateParams, ContextService){
    if(!$stateParams || (!$stateParams.showimage_id) || $stateParams.showimage_id === '0') {
      return null;
    }
    return ContextService.setCurrentShowImage($stateParams.showimage_id)
    .then(function(data){
      return ContextService.currentShowImage = data;
    });
  };
      
  function memberAuth($location, $auth, $http, ContextService) {
  };
})
.run(function($rootScope, $window, jwtHelper) {
  // console.log('HELPER',jwtHelper.decodeToken(localStorage.memberToken))
  // $rootScope.memberCurrent = null;
  //
  // if(localStorage.memberToken) {
  //   $rootScope.memberCurrent = jwtHelper.decodeToken($window.localStorage.memberToken);
  // }

})
.service('jwtMemberInterceptor', ['$rootScope', 'jwtHelper',
  function jwtMemberInterceptor($rootScope, jwtHelper){
  // Attach the token to every request.
  return {
    request: function(config){
      $rootScope.memberToken = null;
      if(localStorage && localStorage.memberToken) {
        config.headers.authorization = 'Bearer ' + localStorage.memberToken;
      }
      return config;
    }
  }
}]);
