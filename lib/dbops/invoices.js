/* INVOICES.js
    description: database access methods for the invoices table
 */

'use strict';

var knex = require('../../config/db/knex');


//////////////////////////////////////////////////////////
// PUBLIC methods
//////////////////////////////////////////////////////////


// catalog implies that all are active
module.exports.saveCart = function(input){
  console.log('SAVE CART INPUT TO DB',input)
  var cart = JSON.parse(input.cart);
  
  // TODO dynamic purchase email
  var purchaseEmail = 'rob@robkurtz.net';
  
  // see if cart exists
  return knex('invoices').where({uniqueid:cart.idx}).first()
  .then(function(data){
    if(data){
      // delete any existing invoice items
      // return the id
      var invId = data.id;
      
      return knex('invoiceitems').del().where({invoice_id:invId})
      .then(function(data){
        return invId;
      });
      
    } else {
      // create a new invoice and return the id
      return knex('invoices').insert({
        //TODO dynamic member_id
        member_id: 1,
        uniqueid: cart.idx,
        purchaseemail: purchaseEmail,
        itemlist: JSON.stringify(cart.items.map(e => e.idx)),
        status: 'inprocess',
        balancedue: cart.items.reduce(function(prev, cur){return prev += (cur.itemPrice * cur.qty);},0)
      })
      .returning('id');
    }
  })
  .then(function(invoice_id){
    
    var _date = Date.now();
    var unc = invoice_id + '_';
    var itemPromises = [];
    
    cart.items.forEach(function(itm){
      itemPromises.push(
        knex('invoiceitems').insert({
          invoice_id: invoice_id,
          ticket_id: (itm.kind === 'ticket') ? itm.item.showdate_id: null,
          product_id: (itm.kind === 'product') ? itm.item.productsku_id : null,
          uniqueid: unc + _date++,
          purchasename: purchaseEmail,
          dtshowdate: (itm.kind === 'ticket') ? itm.item._parentShowDate.dateofshow: null,
          name: itm.mainDesc,
          ages: (itm.kind === 'ticket') ? itm.item.ages : '',
          description: itm.secondaryDesc.reduce(function(prev,cur){return prev += ' ' + cur;},'').trim(),
          price: itm.itemPrice,
          quantity: itm.qty,
          lineitemtotal: itm.itemPrice * itm.qty,
          status: 'inprocess'
        })
      );
    })
    
    return Promise.all(itemPromises);
  })
  .then(function(data){
    // evaluate return data and return
    // console.log('POST PROMISE', data)
    return 'success';
  });
  
};
