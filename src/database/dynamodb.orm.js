const dynamoDbClient = require('./dynamodb');

const create = async (table, data) => {
  try {
    await dynamoDbClient
      .put({
        TableName: table,
        Item: data
      })
      .promise();

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const findByFileName = async (table, fileKey) => {
  try {
    const { Items } = await dynamoDbClient
      .query({
        TableName: table,
        IndexName: 'fileKeyIndex',
        KeyConditionExpression: 'fileKey = :value',
        ExpressionAttributeValues: {
          ':value': fileKey
        }
      })
      .promise();

    if (!Items) {
      return null;
    }

    return Items[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  create,
  findByFileName
};
