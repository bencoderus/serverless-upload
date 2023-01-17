const AWS = require('aws-sdk');

const dynamoDbClientParams = {};

if (process.env.IS_OFFLINE) {
  dynamoDbClientParams.region = 'us-east-1';
  dynamoDbClientParams.endpoint =
    process.env.DYNAMODB_LOCAL_ENDPOINT || 'http://localhost:4566';
}

module.exports = new AWS.DynamoDB.DocumentClient(dynamoDbClientParams);
