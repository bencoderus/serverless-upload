const fileService = require('./api/services/file.service');

module.exports.handler = async (event) => {
    const objectKey = event.Records[0].s3.object.key;

    await fileService.markFileNameAsUsed(objectKey);

    console.log('Processed:', objectKey)

    return {
        statusCode: 200,
    }
    
}