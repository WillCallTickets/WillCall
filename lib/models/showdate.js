'use strict';

var Show = require('./show');
var ShowTicket = require('./showticket');

class ShowDate {
  
  constructor(row){
    this.id = row.id;
    this.created_at = row.created_at;
    this.updated_at = row.updated_at;
    this.show_id = row.show_id;
    this.dateofshow = row.dateofshow;
    this.doorsopen = row.doorsopen;
    this.name = row.name;
    this.ages = row.ages;
    this.billing = row.billing;
    this.pricing = row.pricing;
    this.description = row.description;
    this.active = row.active;
    this.status = row.status;
    this.showTickets = [];
  };
  
  static _ShowDates_FromRows(row, ticketRows){
    var _showdate = new ShowDate(row);
    _showdate.showTickets = ticketRows.map(e => new ShowTicket(e));
    return _showdate;
  };
  
};

module.exports = ShowDate;
