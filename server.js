
require('dotenv').config({silent:true});

var express             = require('express');
var path                = require('path');
var logger              = require('morgan');
var compression         = require('compression');
var cookieParser        = require('cookie-parser');
var bodyParser          = require('body-parser');
var expressValidator    = require('express-validator');
var favicon             = require('serve-favicon');
var request             = require('request');
var qs                  = require('querystring');
var sass                = require('node-sass-middleware');
var cookieSession       = require('cookie-session');
var jwt                 = require('jsonwebtoken');
var moment              = require('moment');


// Controllers
var apiController       = require('./server/controllers/api');
var productsController  = require('./server/controllers/products');
var showsController     = require('./server/controllers/shows');
var resourceController  = require('./server/controllers/resource');
var membersController   = require('./server/controllers/members');
var ordersController    = require('./server/controllers/orders');
var storeController     = require('./server/controllers/store');


// Declare app and configure
var app = express();

app.use(cookieSession(
  {
    name: 'session',
    keys: [
      process.env.SESSION_KEY1,
      process.env.SESSION_KEY2,
      process.env.SESSION_KEY3
    ]
  }
));


app.set('port', process.env.PORT || 3000);
app.use(compression());
app.use(sass({ src: path.join(__dirname, 'public'), dest: path.join(__dirname, 'public') }));
app.use(favicon(path.join(__dirname, './public/images', 'favicon-96x96.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());


app.set('views', path.join(__dirname, '/server/views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));



////////////////////////////////////////////////////////////
// SERVER SIDE ROUTING
////////////////////////////////////////////////////////////

const stripeRouter = require('./routes/stripe');
app.use('/stripe', stripeRouter);

const apiRouter = require('./routes/api');
app.use('/api', apiRouter);

const storeRouter = require('./routes/store');
app.use('/store', storeRouter);

// Proxy Resource - resolves by correcting https and http for resources
app.get('/proxyresource/:resourceurl',
  resourceController.proxyResource);



///////////////////////////////////////////////////////////
// ANGULAR ROUTING client side
///////////////////////////////////////////////////////////
app.use(function(req, res) {
  res.redirect('/#' + req.originalUrl);
});


///////////////////////////////////////////////////////////
// ERROR HANDLING
///////////////////////////////////////////////////////////

// Production error handler
if (app.get('env') === 'production') {
  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.sendStatus(err.status || 500);
  });
}


app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
