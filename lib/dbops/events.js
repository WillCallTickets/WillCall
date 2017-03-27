////////////////////////////////////////////////////////////
// EVENTS.js
//
// database access methods for the events
////////////////////////////////////////////////////////////

var knex = require('../../config/db/knex');
var firstBy = require('thenby');

// PUBLIC methods

// retrieve a listing of member events
module.exports.getMemberEventCollection = function(member_id){
  return knex('eventqs').where({affectedid:member_id}).orderBy('id','desc').limit(50);
};

// TODO implement Stripe webhooks
module.exports.recordWebhook = function(json_event){
  return new Promise(function(resolve, reject){

    return resolve('aok')
  });
};
