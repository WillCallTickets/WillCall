////////////////////////////////////////////////////////////
// Brochure Service
//
// Services for handling brochures
////////////////////////////////////////////////////////////

angular.module('wctApp')
  .service('BrochureService',
    [ '$http', '$q', '$stateParams',
      
    function($http, $q, $stateParams){
    
      var _self = this;
      this.listing = null;
      this.addMode = false;
  
      // assign the current edit item by state.brochure_id
      this.currentEdit = function(){
        if($stateParams.brochure_id){
          return _self.listing.find(function(itm){
            return itm.id === parseInt($stateParams.brochure_id);
          });
        }
        return null;
      };
  
      this.setAddMode = function(active){
        _self.addMode = active;
      };
  
      // add a new item and add to listing
      this.addBrochure = function(brochure){
        return $http.post('/api/brochures/', {brochure})
        .then(function(data){
          _self.listing.push(data.data);
        });
      };

      // update an item and refresh listing
      this.updateBrochure = function(brochure){
        return $http.put('/api/brochures/' + _self.currentEdit().id, {brochure})
        .then(function(data){
          // refresh updated data
          _self.getListing();
        });
      };
  
      // get the list of brochure items
      this.getListing = function(){
        _self.listing = [];
        $http.get('/api/brochures')
        .then(function(data){
          _self.listing = data.data;
        })
        .catch(function(err) {
          console.log('Error', err)
        });
      };
      
      // init the listing
      this.getListing();

  }]);