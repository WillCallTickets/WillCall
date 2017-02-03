'use strict'

var knex = require('../../config/db/knex');
const expect = require("chai").expect;
const config = require('../../lib/dbops/configs');

describe("#linearSearch", function(){

  it("can run the test query", function() {
    return config.getShowTest()
    .then(function(data){
      // console.log('SHOW TEST', data);
    })
    .catch(function(err){
      // console.log('ERR',err);
    });
  });
});

