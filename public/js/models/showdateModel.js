angular.module('MyApp').factory('ShowDate',
  ['$http', '$q', 'ShowTicket',
    function($http, $q, ShowTicket){
      
      function ShowDate(row, ticketRows = null){
        this.id = row.id;
        this.created_at = row.created_at;
        this.updated_at = row.updated_at;
        this.show_id = row.show_id;
        this.dateofshow = row.dateofshow;
        this.doorsopen = row.doorsopen;
        this.name = row.name;
        this.ages = row.ages;
        this.billing = row.billing;
        this.pricing = row.pricing;
        this.description = row.description;
        this.active = row.active;
        this.status = row.status;
        this.showtickets = [];
        
        if(ticketRows && ticketRows.length > 0){
          this.showtickets = ticketRows.map(e => new ShowTicket(e, row));
        };
  
        this._parentShow = null;
      };
      
      ShowDate.prototype = {
        parentShow(row){
          this._parentShow = row;
        }
      };
      
      ////////////////////////////////////////////
      // STATIC methods
      ////////////////////////////////////////////
  
      ShowDate.processForm = function(form, input, currentShowDate, currentShow){
    
        var deferred = $q.defer();
    
        var errors = [];
        
        input.show_id = (currentShowDate) ?
          currentShowDate.show_id : (currentShow) ? currentShow.id : -1;
    
        $http.post('/api/showdates', {
          input: input,
          current: currentShowDate
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
  
      // Convert to ShowDate Objects
      ShowDate.buildShowDateCollection = function(dateRows, ticketRows) {
        return dateRows.map(function (date) {
          var matches = ticketRows.filter(e => e.showdate_id === date.id);
          if (matches.length > 1) {
            matches.sort((a, b) => a.price - b.price);
          }
          return new ShowDate(date, matches);
        });
      };
      
      return ShowDate;
}]);

