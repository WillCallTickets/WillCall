const express = require('express');
const router = express.Router();

// Controllers
var storeController     = require('../server/controllers/store');


/////////////////////////
// store/order routes
/////////////////////////
router.post('/checkout', storeController.stripeVerifyCallback);

