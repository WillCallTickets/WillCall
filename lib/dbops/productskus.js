/* PRODUCTSKUS.js
    description: database access methods for the productskus table
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
  
  if(current){
    return knex('productskus').update(input).where({id:current.id}).returning('id');
  } else {
    
    // TODO check for existing showdate with the same date
    
    return knex('productskus')
    .where({product_id: input.product_id, name: input.name}).first()
    .then(function(data) {
      var existing = data;
      
      if(existing){
        throw Error('A productsku with the specified division and name already exists for the current product');
      }
      
      return knex('productskus').insert(input).returning('id');
    });
  }
};

module.exports.getProductSkuById = function(productsku_id){
  return buildProductSkuFromInitialQuery(
    knex('productskus').where({id:productsku_id}));
};


//////////////////////////////////////////////////////////
// PRIVATE methods
//////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////
// THIS DOES NOT RETURN FULL HEIRARCHY!!!
/////////////////////////////////////////////////////////////////
// Given a query(promise) fetch data with the given pattern
var buildProductSkuFromInitialQuery = function(query) {
  var productListing = {};
  return query
  .then(function (data) {
    productListing.productskus = data;
    return knex('products').whereIn('id', productListing.productskus.map(e => e.product_id));
  })
  .then(function(data){
    productListing.products = data;
    return productListing;
  });
};
