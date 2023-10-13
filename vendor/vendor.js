'use strict';

const { Consumer } = require('sqs-consumer');
const { SQSClient } = require('@aws-sdk/client-sqs');
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });

var Chance = require('chance');
const chance = new Chance();


const sns = new AWS.SNS();
const pickupTopicArn = 'arn:aws:sns:us-west-2:445715241945:pickup.fifo';


function createPickup(orderDetails, orderId) {
  // Creating and stringifying the message payload
  const payload = {
    Subject: 'Pickup is ready',
    Message: orderDetails,
    TopicArn: pickupTopicArn,
    MessageGroupId: orderId,
    MessageDeduplicationId: chance.guid(),
  };

  // Publishing the message to the SNS topic
  sns.publish(payload).promise()
  .then(data => {
    console.log(data);
  })
  .catch(err => {
    console.error('Something went wrong', err);
  });
}

const app = Consumer.create({
  queueUrl: 'https://sqs.us-west-2.amazonaws.com/445715241945/delivered.fifo',
  handleMessage: async (message) => {
    console.log('Received Delivery Message:', JSON.parse(message.Body));
  },
  sqs: new SQSClient({
    region: 'us-west-2',
  })
});

app.on('error', (e) => {
  console.log('Error Occurred in the Delivered Queue:', e);
});

app.start(); // Start listening for messages

module.exports = createPickup;