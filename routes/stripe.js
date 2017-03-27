const express = require('express');
const router = express.Router();

////////////////////////////////////////////////////////////
// Controllers
////////////////////////////////////////////////////////////
const membersController   = require('../server/controllers/members');

////////////////////////////////////////////////////////////
// Stripe Routes
////////////////////////////////////////////////////////////
router.get('/login',              membersController.stripeLogin);
router.get('/callback',           membersController.stripeAuthCallback);
router.post('/webhook/account/',  membersController.stripeAccountWebhook);
router.post('/webhook/connect/',  membersController.stripeConnectWebhook);


module.exports = router;