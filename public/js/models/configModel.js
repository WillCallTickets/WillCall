angular.module('MyApp').factory('Config',
  ['$http', '$q', 'moment', function($http, $q, moment){
  
    function Config(row, dateModels = null){
      this.id = row.id;
      this.created_at = row.created_at;
      this.updated_at = row.updated_at;
      this.member_id = row.member_id;
      this.context = row.context;
      this.description = row.description;
      this.key = row.key;
      this.value = row.value;
      this.datatype = row.datatype;
      this.required = row.required;
      this.active = row.active;
      this.allowoverride = row.allowoverride;
    };
  
    ////////////////////////////////////////////
    // STATIC methods
    ////////////////////////////////////////////
    
    Config.processForm = function(form, input, currentConfig){
    
      var deferred = $q.defer();
    
      var errors = [];
      
      $http.post('/api/configs', {
        input: input,
        current: currentConfig
      })
      .then(function(data){
        var returnData = data.data;
        deferred.resolve(returnData);
      })
      .catch(function(err){
        //convert err to array and return
        errors.push(err.data);
        deferred.reject(errors);
      })
      
      return deferred.promise;
    };
  
    // Convert to Config Objects
    Config.buildConfigFromRow = function(configRows) {
      return configRows.map(function (config) {
        return new Config(config);
      });
    };
  
  return Config;
}]);
