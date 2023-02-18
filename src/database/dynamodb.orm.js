const dynamoDbClient = require('./dynamodb');

module.exports = {
  async create(table, data) {
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
  },

  async markFileNameAsUsedById(table, fileKey) {
      const record = await this.findByFileName(table, fileKey);

      if (!record) {
        throw new Error('File name is not valid');
      }

      const usedAt = new Date().toISOString();

      const params = {
        TableName: table,
        Key: {
          id: record.id
        },
        UpdateExpression: 'set usedAt = :v',
        ExpressionAttributeValues: {
          ':v': usedAt
        }
      };

      return dynamoDbClient.update(params).promise();
  },

  async markFileNameAsUsedByKey(table, fileKey) {
    const usedAt = new Date().toISOString();

    const params = {
      TableName: table,
      Key: {
        fileKey
      },
      UpdateExpression: 'set usedAt = :v',
      ExpressionAttributeValues: {
        ':v': usedAt
      }
    };

    const response = await dynamoDbClient.update(params).promise();

    return response;
},

  async findByFileName(table, fileKey) {
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
  }
};
