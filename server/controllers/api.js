require('dotenv').config({silent:true});

var knex = require('../../config/db/knex');
var configs = require('../../lib/dbops/configs');


////////////////////////////////////////////////////////////
// Configs
////////////////////////////////////////////////////////////

exports.getConfigById = function(req, res){
  configs.getConfigById(req.params.config_id)
  .then(function(data){
    res.json(data);
  });
};

exports.createOrUpdateConfig = function(req,res){
  configs.createOrUpdate(req.body.input, req.body.current)
  .then(function(data){
    res.status(200).json(data);
  })
  .catch(function(err){
    res.status(400).json(err.message);
  });
};


////////////////////////////////////////////////////////////
// Brochures - the marketing cells on the home page
////////////////////////////////////////////////////////////

exports.getBrochures = function(req, res){
  knex('brochures').select('*')
  .orderBy('id')
  .then(function(data){
    res.json(data);
  });
};

exports.getBrochure = function(req, res) {
  return knex.select().table('brochures').where('id', req.params.id)
  .first()
  .then(function(brochure){
    res.status(200).json(brochure);
  });
};

exports.updateBrochure = function(req, res){
  return knex('brochures')
  .where({id:req.params.id})
  .update(req.body.brochure)
  .then(function(data){
    res.json(data); // data will be 1 on success
  });
};

exports.addBrochure = function(req, res){
  return knex('brochures').insert(req.body.brochure)
  .returning('id')
  .then(function(id){
    res.redirect('/api/brochures/' + id)
  });
};

// TODO authenticate
exports.getEnvKey = function(req, res){
  console.log('get key')
  var key = process.env[req.params.keyname];
  res.json(key);
};
