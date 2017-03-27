require('dotenv').config({silent:true});

var shows = require('../../lib/dbops/shows');
var showdates = require('../../lib/dbops/showdates');
var showtickets = require('../../lib/dbops/showtickets');


//////////////////////////////////////////////////////////////////////
// SHOWS
//////////////////////////////////////////////////////////////////////

exports.getShowById = function(req, res){
  shows.getShowById(req.params.show_id)
  .then(function(data){
    res.json(data);
  });
};

exports.createOrUpdateShow = function(req,res){
  shows.createOrUpdate(req.body.input, req.body.current)
  .then(function(data){
    res.status(200).json(data);
  })
  .catch(function(err){
    res.status(400).json(err.message);
  });
};


//////////////////////////////////////////////////////////////////////
// SHOW DATES
//////////////////////////////////////////////////////////////////////

exports.getShowDateById = function(req, res){
  showdates.getShowDateById(req.params.showdate_id)
  .then(function(data){
    res.json(data);
  });
};

exports.createOrUpdateShowDate = function(req,res){
  showdates.createOrUpdate(req.body.input, req.body.current)
  .then(function(data){
    res.status(200).json(data);
  })
  .catch(function(err){
    res.status(400).json(err.message);
  });
};


//////////////////////////////////////////////////////////////////////
// SHOW TICKETS
//////////////////////////////////////////////////////////////////////

exports.getShowTicketById = function(req, res){
  showtickets.getShowTicketById(req.params.showticket_id)
  .then(function(data){
    res.json(data);
  });
};

exports.createOrUpdateShowTicket = function(req,res){
  showtickets.createOrUpdate(req.body.input, req.body.current)
  .then(function(data){
    res.status(200).json(data);
  })
  .catch(function(err){
    res.status(400).json(err.message);
  });
};