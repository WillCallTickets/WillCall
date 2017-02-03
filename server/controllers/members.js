require('dotenv').config({silent:true});
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var jwt = require('jsonwebtoken');
var moment = require('moment');
var request = require('request');
var qs = require('querystring');
var members = require('../../lib/dbops/members');
var products = require('../../lib/dbops/products');
var events = require('../../lib/dbops/events');
var shows = require('../../lib/dbops/shows');
var configs = require('../../lib/dbops/configs');


function generateToken(member) {
  var payload = {
    iss: process.env.HOST,
    sub: member.id,
    iat: moment().unix(),
    exp: moment().add(7, 'days').unix(),
    sid: member.stripeuserid,
    member: member
  };
  return jwt.sign(payload, process.env.TOKEN_SECRET);
}


//////////////////////////////////////////////////////////////////////
// MEMBER PRODUCTS
//////////////////////////////////////////////////////////////////////

exports.getMemberProductListing = function(req, res){
  products.getMemberProductListing(req.params.member_id)
  .then(function(data){
    res.json(data);
  });
};


//////////////////////////////////////////////////////////////////////
// MEMBER SHOWS
//////////////////////////////////////////////////////////////////////

// get members shows' - simple get
exports.getMemberShowListing = function(req, res){
  shows.getMemberShowListing(req.params.member_id)
  .then(function(data){
    res.json(data);
  });
};


//////////////////////////////////////////////////////////////////////
// MEMBER EVENTS
//////////////////////////////////////////////////////////////////////

exports.getMemberEvents = function(req, res){
  events.getMemberEventCollection(req.params.member_id)
  .then(function(data){
    res.json(data);
  });
};

//////////////////////////////////////////////////////////////////////
// MEMBER CONFIGS
//////////////////////////////////////////////////////////////////////

exports.getMemberConfigs = function(req, res){
  configs.getMergedConfigCollection(req.params.member_id)
  .then(function(data){
    res.json(data);
  });
};


//////////////////////////////////////////////////////////////////////
// STRIPE Webhook callbacks - stripe event logging
// TODO can't do this locally - but we will need a way to record member
// events and have a way to retrieve them
// this may be handled better in a separate EVENTS file
//////////////////////////////////////////////////////////////////////

// application account events
exports.stripeAccountWebhook = function(req, res){
  // console.log('ACCOUNT WEBHOOK')
  events.recordWebhook(req.body)
  .then(function(data){
    response.send(200);
  });
};

// member events
exports.stripeConnectWebhook = function(req, res){
  // console.log('CONNECT WEBHOOK', req.body)
  events.recordWebhook(req.body)
  .then(function(data){
    res.sendStatus(200);
  });
};


//////////////////////////////////////////////////////////////////////
// STRIPE AuthCallback
//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////
// The member will login (or decline) from Stripe
// Stripe returns a "code" and not a "token" (it's oath v1)
// Use this code to get the member's auth codes
// A third call will be necessary to get member details
// Keep this short and sweet - don't let stripe steal your life cycles
// *** see helper functions below
//////////////////////////////////////////////////////////////////////

exports.stripeLogin = function(req, res) {
  
  // var url = 'https://connect.stripe.com/oauth/authorize?response_type=code&client_id=';
  res.redirect('https://connect.stripe.com/oauth/authorize?' + qs.stringify({
    response_type: "code",
    scope: "read_write",
    client_id: process.env.STRIPE_CLIENT_ID
  }));
  
};

exports.stripeAuthCallback = function(req, res) {
  var code = req.query.code;

  if(code) {
    return exports.stripeGetAuthTokens(code)
    .then(function(_data){
      return ensureMembersTableEntry(_data);
    })
    .then(function(_member){
      res.render('memberToken', { memberToken: generateToken(_member) });
    });
  } else {
    // TODO  indicate user denied access
    // { error: 'access_denied', error_description: 'The user denied your request' }
    
    res.redirect('/members/signin');
  }
};



//////////////////////////////////////////////////////////////////////
// AuthCallback Helper Funcs
//////////////////////////////////////////////////////////////////////


// ensureMembersTableEntry
// Determine if member row exists the update
//   with new stripe token info
function ensureMembersTableEntry(body){
  var _stripeid     = body.stripe_user_id;
  var _accessToken  = body.access_token;
  var _refreshToken = body.refresh_token;
  var _publishKey   = body.stripe_publishable_key;
  
  return members.getMember_ByStripeUserId(_stripeid)
  .then(function (_member) {
    // console.log('ENSURE - first return', _member)
    if (_member) {
      // console.log('ENSURE - WE HAVE MEMBER')
      // we have an existing member - update stripe token info
      return members.updateMemberStripe_ByStripeUserId(
        _stripeid, _publishKey, _accessToken, _refreshToken);
    } else {
      // console.log('ENSURE - NO MEMBER')
      // create a new member - the update with a stripe info call
      return members.createMemberStripe(
        _stripeid, _publishKey, _accessToken, _refreshToken)
      .then(function(__member){
        // console.log('ENSURE - JUST CREATED MEMBER')
        return exports.updateMemberStripeDetails(__member);
      });
    }
  });
};


// stripeGetAuthTokens
// Call Stripe API and get applicable auth tokens for
//   member account - granted by code
//   Note: code is only valid for 5 minutes
exports.stripeGetAuthTokens = function(code){
  return new Promise(function(resolve, reject) {
    request.post({
      url: process.env.STRIPE_TOKEN_URL,
      form: {
        grant_type: "authorization_code",
        client_id: process.env.STRIPE_CLIENT_ID,
        code: code,
        client_secret: process.env.STRIPE_SECRET
      }
    }, function (err, response, body) {
      if (err) {
        reject('ERROR: ' + err);
      } else {
        var _body = JSON.parse(body);
        resolve(_body);
      }
    });
  });
};


// updateMemberStripeDetails
// Update the member in db with stripe account details
// get stripe info: https://stripe.com/docs/api#retrieve_account
exports.updateMemberStripeDetails = function(_member){
  return new Promise(function(resolve, reject){
    var stripe = require("stripe")(process.env.STRIPE_SECRET);
    stripe.accounts.retrieve(
      _member.stripeuserid,
      function(err, account) {
        if(err){
          reject(err);
        } else {
          resolve(members.updateMemberAccountInfo_ByStripeAccount(account));
        }
      }
    );
  });
};
