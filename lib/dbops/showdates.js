////////////////////////////////////////////////////////////
// SHOWDATES.js
//
// database access methods for the showDates table
////////////////////////////////////////////////////////////
'use strict';

var knex = require('../../config/db/knex');

// PUBLIC methods

// create new or update existing
module.exports.createOrUpdate = function(input, current){
  
  if(current){
    return knex('showdates').update(input).where({id:current.id}).returning('id');
  } else {
  
    // TODO check for existing showdate with the same date
    return knex('showdates').where({show_id: input.show_id, dateofshow: input.dateofshow}).first()
    .then(function(data) {
      var existing = data;
      
      if(existing){
        throw Error('A showdate with the specified date already exists for the current show');
      }
  
      return knex('showdates').insert(input).returning('id');
    });
  }
};

// retrieve by id
module.exports.getShowDateById = function(showdate_id){
  return buildShowDateFromInitialQuery(
    knex('showdates').where({id:showdate_id})
    .orderBy('dateofshow','asc'));
};

// PRIVATE methods

// Given a query(promise) fetch data with the given pattern
var buildShowDateFromInitialQuery = function(query) {
  var showListing = {};
  // TODO implement correct ordering
  
  return query
  .then(function (data) {
    showListing.showdates = data;
    return knex('shows').whereIn('id', showListing.showdates.map(e => e.show_id));
  })
  .then(function(data) {
    showListing.shows = data;
    return knex('showtickets').whereIn('showdate_id', showListing.showdates.map(e => e.id));
  })
  .then(function(data){
    showListing.showtickets = data;
    return showListing;
  });
};
