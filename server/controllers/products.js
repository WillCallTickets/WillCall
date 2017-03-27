require('dotenv').config({silent:true});

var products = require('../../lib/dbops/products');
var productskus = require('../../lib/dbops/productskus');


//////////////////////////////////////////////////////////////////////
// PRODUCTS
//////////////////////////////////////////////////////////////////////

exports.getProductById = function(req, res){
  products.getProductById(req.params.product_id)
  .then(function(data){
    res.json(data);
  });
};

exports.createOrUpdateProduct = function(req,res){
  products.createOrUpdate(req.body.input, req.body.current)
  .then(function(data){
    res.status(200).json(data);
  })
  .catch(function(err){
    res.status(400).json(err.message);
  });
};


//////////////////////////////////////////////////////////////////////
// PRODUCTSKUS
//////////////////////////////////////////////////////////////////////

exports.getProductSkuById = function(req, res){
  productskus.getProductSkuById(req.params.productsku_id)
  .then(function(data){
    res.json(data);
  });
};

exports.createOrUpdateProductSku = function(req,res){
  productskus.createOrUpdate(req.body.input, req.body.current)
  .then(function(data){
    res.status(200).json(data);
  })
  .catch(function(err){
    res.status(400).json(err.message);
  });
};
