'use strict';
//this is like sns-publish

const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });

const sns = new AWS.SNS();

const topic = 'arn:aws:sns:us-west-2:445715241945:banana';  // arn from the SNS console

const payload = {
  Subject: 'I love publishing',
  Message: 'Hello from SNS',
  TopicArn: topic,
};

sns.publish(payload).promise()
.then(data => {
  console.log(data);
})
.catch(err => {
  console.error('Something went wrong', err);
});


