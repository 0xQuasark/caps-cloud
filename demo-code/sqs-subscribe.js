'use strict';

// const { Consumer } = require('sqs-consumer');
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });
var sqs = new AWS.SQS();

const queueURL = 'https://sqs.us-west-2.amazonaws.com/445715241945/BananaMessages';

const params = {
  QueueUrl: queueURL,
}

function handleMessages(err, data) {
  if (err) {
    console.log("Receive Error", err);
  } else if (data.Messages) {
    console.log("Message Received", data.Messages);
    
    var deleteParams = {
      QueueUrl: queueURL,
      ReceiptHandle: data.Messages[0].ReceiptHandle
    };
    sqs.deleteMessage(deleteParams, function(err, data) {
      if (err) {
        console.log("Delete Error", err);
      } else {
        console.log("Message Deleted", data);
      }
    });
  }
}

sqs.receiveMessage(params, handleMessages);

// const app = Consumer.create({
//   queueUrl: queueURL,
//   handleMessage: async (message) => {
//     console.log(message);
//   }
// });

// app.start();

