

exports.stripeVerifyCallback = function(req, res) {
  console.log('debug CALLBACK STRIPE');

  //TODO verify matching amounts - correct amount

  // Get the credit card details submitted by the form
  var token = req.body.stripeToken;
  var eml = req.body.stripeEmail;
  var stripe = require("stripe")(process.env.STRIPE_SECRET);

  // Create a charge: this will charge the user's card
  var _charge = null;
  stripe.charges.create({
    amount: 999, // Amount in cents
    currency: "usd",
    source: token,
    receipt_email: eml,
    description: "TODO: list invoice items here"
  })
  .then(function(charge){
    _charge = charge;
    res.redirect('/orders/success');
  })
  .catch(function(err){
    console.log('THE CARD HAS BEEN DECLINED', err)
    // TODO save the error in session? for display in verify page
    // redirect to verify
    res.redirect('/orders/verify');
  })
};