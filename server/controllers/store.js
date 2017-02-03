require('dotenv').config({silent:true});
var knex = require('../../config/db/knex');

var products = require('../../lib/dbops/products');
var shows = require('../../lib/dbops/shows');
var invoices = require('../../lib/dbops/invoices');

// Notes on Stripe
// https://stripe.com/docs/recipes/variable-amount-checkout
// http://code.tutsplus.com/tutorials/how-to-accept-payments-with-stripe--pre-80957
// some sort of hack for price info???
// https://www.masteringmodernpayments.com/blog/using-stripe-checkout-for-subscriptions


exports.stripeVerifyCallback = function(req, res) {
  
  console.log('debug VERIFY CALLBACK STRIPE', req.params, req.body);
  var token = req.body.stripeToken;
  var eml = req.body.stripeEmail;
  var amount = req.body.f_amount;
  var cartid = req.body.f_cartid;
  
  
  knex('invoices').where({uniqueid:cartid}).first()
  .then(function(data){
    var amountToCharge = data.balancedue;
    
    // TODO validate amount against db - look for tampering
    // Get the credit card details submitted by the form
    //TODO verify matching amounts - correct amount
    
    var stripe = require("stripe")(process.env.STRIPE_SECRET);
  
    stripe.charges.create({
      amount: amountToCharge * 100, // Amount in cents
      currency: "usd",
      source: token,
      receipt_email: eml,
      description: "TODO: list invoice items here"
    })
    .then(function(charge){
      console.log('CHARGE',charge)
      
      //update invoice and items
      knex('invoices').update({
        totalpaid: amountToCharge * 100,
        balancedue: 0,
        netpaid: amountToCharge * 100,
        status: 'complete'
      }).where({uniqueid:cartid}).returning('id')
      .then(function(invoiceid){
        //update status of invoice items
        return knex('invoiceitems').update({status:'complete'}).where({invoice_id:parseInt(invoiceid)});
      })
      .then(function(data){
        res.redirect('/store/checkout/success');
      });
      
    })
    .catch(function(err){
      console.log('THE CARD HAS BEEN DECLINED', err)
      // TODO save the error in session? for display in verify page
      // redirect to verify
      res.redirect('/store/checkout');
    });
    
  })
};

//////////////////////////////////////////////////////////////////////
// CART
//////////////////////////////////////////////////////////////////////

// retrieve active shows/dates/etc to be built by client
exports.saveStoreCart = function(req,res){
  invoices.saveCart(req.body)
  .then(function(data){
    console.log('WE HAVE RETURNED TO API', data)
    res.json(data);
  });
};

//////////////////////////////////////////////////////////////////////
// SHOW CATALOGS
//////////////////////////////////////////////////////////////////////

// retrieve active shows/dates/etc to be built by client
exports.getShowCatalog = function(req,res){
  shows.getShowCatalog()
  .then(function(data){
    res.json(data);
  });
};


//////////////////////////////////////////////////////////////////////
// PRODUCT CATALOGS
//////////////////////////////////////////////////////////////////////

// retrieve active product/skus to be built by client
exports.getProductCatalog = function(req,res){
  products.getProductCatalog()
  .then(function(data){
    res.json(data);
  });
};