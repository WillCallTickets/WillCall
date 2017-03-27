var request = require('request');
var atob = require('atob');

// This enables a workaround for the http/https mixed content images (resources) error
// For other solutions, see: https://developers.google.com/web/fundamentals/security/prevent-mixed-content/fixing-mixed-content

exports.proxyResource = function(req, res, next) {
  
  // decode and send back as a stream
  var decodedString = atob(req.params.resourceurl);
  // console.log('PXY API atob', decodedString, req.params.resourceurl);
  
  request(decodedString).pipe(res);
};
