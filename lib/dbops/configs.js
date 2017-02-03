/* CONFIG.js
    description: database access methods for the config table
    notes:  each user will start with the base config and have their
            own individual settings applied on top of the base
 */


var knex = require('../../config/db/knex');
var firstBy = require('thenby');


  // testing
module.exports.getShowTest = function() {
  return knex('shows').first();
};

  // TODO ensure only one base config
  // seed it?

  // return a collection of configs that do not have a specific user assigned
  // these configs comprise the "baseConfig'
module.exports.getBaseConfigCollection = function(){
  return knex('configs').whereNull('member_id');
};

module.exports.getMemberConfigCollection = function(member_id){
  return knex('configs').where({member_id:member_id});
};

module.exports.getMergedConfigCollection = function(member_id){
  // console.log('GET MERGED COLLECTION')
  var _baseKeys = []; // storage array
  
  return exports.getBaseConfigCollection()
  .then(function(data){
    _baseKeys = data;
    return exports.getMemberConfigCollection(member_id);
  })
  .then(function(data){
    // merge keys/data
    var _userKeys = data;
    var merged = _baseKeys.map(function(item){
      // find a matching element from the users collection
      // if one exists and it is active - then return that one with member_id
      var match = _userKeys.filter(function(itm){
        return (item.allowoverride &&
          itm.context === item.context &&
          itm.key === item.key );
      });
      return (match.length) ? match[0] : item;
    });
    
    // sort by context asc then by key
    // https://github.com/Teun/thenBy.js
    merged.sort(
      // firstBy(function (v1, v2) { return v2.context > v1.context; })//desc
      firstBy("context")
      .thenBy("key")
    );
    return merged;
  });
};


module.exports.getConfigById = function(config_id){
  return knex('configs').where({id:config_id});
};


module.exports.createOrUpdate = function(input, current){
  return knex('configs').where({id:current.id}).first()
  .then(function(data) {
    var _config = data;
    
    if(!_config.member_id){
      // copy current config
      return knex('configs').insert({
        member_id: input.member_id,
        context: _config.context,
        description: _config.description,
        key: _config.key,
        value: input.value,
        datatype: _config.datatype,
        required: _config.required,
        active: true,
        allowoverride: false // default value for member configs
      }).returning('id');
    } else {
      // update the current config
      return knex('configs').where({id:current.id}).update({value: input.value}).returning('id');
    }
  });
};
