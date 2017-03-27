const express = require('express');
const router = express.Router();

////////////////////////////////////////////////////////////
// Controllers
////////////////////////////////////////////////////////////
var apiController       = require('../server/controllers/api');
var productsController  = require('../server/controllers/products');
var showsController     = require('../server/controllers/shows');
var membersController   = require('../server/controllers/members');
var storeController     = require('../server/controllers/store');

////////////////////////////////////////////////////////////
// api routes
////////////////////////////////////////////////////////////
router.get('/configs/:config_id',                      apiController.getConfigById);
router.post('/configs',                                apiController.createOrUpdateConfig);
router.get('/products/:product_id',                    productsController.getProductById);
router.post('/products',                               productsController.createOrUpdateProduct);
router.get('/productskus/:productsku_id',              productsController.getProductSkuById);
router.post('/productskus',                            productsController.createOrUpdateProductSku);
router.get('/shows/:show_id',                          showsController.getShowById);
router.post('/shows',                                  showsController.createOrUpdateShow);
router.get('/showdates/:showdate_id',                  showsController.getShowDateById);
router.post('/showdates',                              showsController.createOrUpdateShowDate);
router.get('/showtickets/:showticket_id',              showsController.getShowTicketById);
router.post('/showtickets',                            showsController.createOrUpdateShowTicket);

////////////////////////////////////////////////////////////
// store routes
////////////////////////////////////////////////////////////
router.get('/store/shows/catalog',    storeController.getShowCatalog);
router.get('/store/products/catalog', storeController.getProductCatalog);
router.post('/store/cartrecord',      storeController.saveStoreCart);

////////////////////////////////////////////////////////////
// member routes
////////////////////////////////////////////////////////////
router.get('/members/:member_id/configs',   membersController.getMemberConfigs);
router.get('/members/:member_id/events',    membersController.getMemberEvents);
router.get('/members/:member_id/products',  membersController.getMemberProductListing);
router.get('/members/:member_id/shows',     membersController.getMemberShowListing);

////////////////////////////////////////////////////////////
// Api misc
////////////////////////////////////////////////////////////
//brochures
router.get('/brochures',        apiController.getBrochures);
router.post('/brochures',       apiController.addBrochure);
router.get('/brochures/:id',    apiController.getBrochure);
router.put('/brochures/:id',    apiController.updateBrochure);
// Env Keys
router.get('/envkey/:keyname',  apiController.getEnvKey);

module.exports = router;