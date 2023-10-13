'use strict';
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });

const { Consumer } = require('sqs-consumer');
const { SQSClient } = require('@aws-sdk/client-sqs');

var Chance = require('chance');
const chance = new Chance();


const sns = new AWS.SNS();

const queueUrl = 'https://sqs.us-west-2.amazonaws.com/445715241945/pickup.fifo';
const deliveredTopicArn = 'arn:aws:sns:us-west-2:445715241945:delivered.fifo';

const app = Consumer.create({
  queueUrl,
  handleMessage: async (message) => {
    let messageBody = JSON.parse(message.Body);
    let MessageGroupId = messageBody.orderId;
    console.log('WE HAVE A NEW MESSAGE!', messageBody);
    
    setTimeout(() => {
      const payload = {
        Subject: 'Delivered',
        Message: JSON.stringify(JSON.parse(message.Body)), // Can modify or add more details if required
        TopicArn: deliveredTopicArn,
        MessageGroupId: MessageGroupId,
        MessageDeduplicationId: chance.guid()
    
      };
      
      sns.publish(payload).promise()
      .then(data => {
        console.log(data);
      })
      .catch(err => {
        console.error('Something went wrong', err);
      });

    }, 1000); // keeping it 1s, for testing purposes.
  },
  sqs: new SQSClient({
    region: 'us-west-2',
  })
});

app.on('error', (e) => {
  console.log('ERROR OCCURED IN QUEUE', e);
});

app.start(); // starts listening for messages from the Queue.