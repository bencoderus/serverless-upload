const AWS = require('aws-sdk');
const crypto = require('crypto');
const config = require('../../config');
const dynamodb = require('../../database/dynamodb.orm');
const FileNotFound = require('../errors/file-not-found.error');

const TABLE_NAME = process.env.FILE_TABLE_NAME || 'files';

module.exports = {
  generateUniqueFileName(filename) {
    if (filename.indexOf('.') < 0) {
      throw new Error('Filename must have an extension.');
    }

    const fileNameArray = filename.split('.');
    const lastIndex = fileNameArray.length - 1;
    const extension = fileNameArray[lastIndex];

    const name =
      fileNameArray.length < 2
        ? fileNameArray[0]
        : fileNameArray.slice(0, lastIndex).join('');

    const uuid = crypto.randomUUID();

    return `${name} ${uuid}.${extension}`.replace(new RegExp(' ', 'g'), '-');
  },

  async getSignedUrlForUpload(filename) {
    const key = this.generateUniqueFileName(filename);
    const params = { Bucket: config.aws.bucket_name, Key: key };

    const s3 = new AWS.S3({
      signatureVersion: 'v4'
    });

    const signedUrl = await s3.getSignedUrlPromise('putObject', params);

    const date = new Date();

    await dynamodb.create(TABLE_NAME, {
      id: crypto.randomUUID(),
      filename,
      fileKey: key,
      createdAt: date.toISOString()
    });

    return {
      fileName: key,
      signedUrl: signedUrl
    };
  },

  async getSignedUrlForDownload(filename) {
    const key = filename;

    const record = await dynamodb.findByFileName(TABLE_NAME, filename);

    if (!record) {
      throw FileNotFound.invalidFileName();
    }

    const params = { Bucket: config.aws.bucket_name, Key: key };

    const s3 = new AWS.S3({
      signatureVersion: 'v4'
    });

    const signedUrl = await s3.getSignedUrlPromise('getObject', params);

    return {
      fileName: key,
      signedUrl: signedUrl
    };
  }
};
