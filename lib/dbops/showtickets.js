/* SHOWTICKETS.js
    description: database access methods for the showtickets table
 */

'use strict';

var knex = require('../../config/db/knex');


//////////////////////////////////////////////////////////
// PUBLIC methods
//////////////////////////////////////////////////////////

module.exports.createOrUpdate = function(input, current){
  
  // normalize data
  if(!input.name)
    input.name = '';
  if(!input.price || input.price === '')
    input.price = 0.0;
  input.active = (input.active == 'true');
  input.deliveryoptions = JSON.stringify([input.deliveryoptions]);
  
  if(current){
    return knex('showtickets').update(input).where({id:current.id}).returning('id');
  } else {
    // TODO check for existing showdate with the same date
    
    return knex('showtickets')
    .where({showdate_id: input.showdate_id, price: input.price, name: input.name, ages: input.ages}).first()
    .then(function(data) {
      var existing = data;
      
      if(existing){
        throw Error('A showticket with the specified price and name already exists for the current show date');
      }
      
      return knex('showtickets').insert(input).returning('id');
    });
  }
};

module.exports.getShowTicketById = function(showticket_id){
  // console.log('DBOPS', show_id)
  return buildShowTicketFromInitialQuery(
    knex('showtickets').where({id:showticket_id})
    .orderBy('price','asc'));
};


//////////////////////////////////////////////////////////
// PRIVATE methods
//////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
// THIS DOES NOT RETURN FULL SHOW!!!
/////////////////////////////////////////////////////////////////
// Given a query(promise) fetch data with the given pattern
var buildShowTicketFromInitialQuery = function(query) {
  var showListing = {};
  // TODO implement correct ordering
  
  return query
  .then(function (data) {
    showListing.showtickets = data;
    return knex('showdates').whereIn('id', showListing.showtickets.map(e => e.showdate_id));
  })
  .then(function(data) {
    showListing.showdates = data;
    return knex('shows').whereIn('id', showListing.showdates.map(e => e.show_id));
  })
  .then(function(data){
    showListing.shows = data;
    return showListing;
  });
};
