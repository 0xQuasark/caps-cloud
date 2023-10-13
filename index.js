'use strict';

const createPickup = require('./vendor/vendor.js');

var Chance = require('chance');

const chance = new Chance();

const order = {
  storeName: chance.company(),
  orderId: chance.guid(),
  customer: chance.name(),
  address: chance.address(),
}

const orderDetails = JSON.stringify(order);
console.log('Order being placed, details: ', order);
createPickup(orderDetails, order.orderId);