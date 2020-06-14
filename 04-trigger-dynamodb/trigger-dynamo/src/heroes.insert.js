const uuid = require('uuid');
const Joi = require('@hapi/joi');
const decoratorValidator = require('./utils/decoratorValidator');
const globalEnum = require('./utils/globalEnum');

class Handler {
  constructor({ dynamoDbSvc }) {
    this.dynamoDbSvc = dynamoDbSvc;
    this.dynamoTable = process.env.DYNAMODB_TABLE;
  }

  static validator() {
    return Joi.object({
      name: Joi.string().max(100).min(2).required(),
      poder: Joi.string().max(20).required(),
    });
  }

  insertItems(dbParams) {
    return this.dynamoDbSvc.put(dbParams).promise();
  }

  prepareData(data) {
    const params = {
      TableName: this.dynamoTable,
      Item: {
        ...data,
        id: uuid.v1(),
        createdAt: new Date().toISOString(),
      }
    };
    return params;
  }

  handlerSuccess(data) {
    const response = {
      statusCode: 200,
      body: JSON.stringify(data),
    };

    return response;
  }

  handlerError(data) {
    return {
      statusCode: data.statusCode || 501,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t create item!',
    }
  }

  async main(event) {
    try {
      // decorator converted to JSON
      const data = event.body;
      const dbParams = this.prepareData(data);
      await this.insertItems(dbParams);
      return this.handlerSuccess(dbParams.Item);
    } catch (error) {
      console.log('Deu ruim**', error.stack);
      return this.handlerError({ statusCode: 500 });
    }
  }
}
// factory
const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const handler = new Handler({
  dynamoDbSvc: dynamoDB,
});

module.exports = decoratorValidator(
  handler.main.bind(handler),
  Handler.validator(),
  globalEnum.ARG_TYPE.BODY,
);
