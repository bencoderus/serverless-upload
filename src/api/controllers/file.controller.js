const {
  badRequestResponse,
  okResponse,
  serverErrorResponse
} = require('response-transformer');
const FileNotFound = require('../errors/file-not-found.error');
const uploadSchema = require('../request-schemas/upload.schema');
const fileService = require('../services/file.service');

const extractValidationMessage = (error) => {
  const message = error.details.map((i) => i.message).join(',');
  return message.replace(/[`~!@#$%^&*()|+\-=?;:'",.<>{}[\]\\/]/gi, '');
};

module.exports = {
  async getUploadUrl(req, res) {
    const { filename } = req.body;
    const validator = uploadSchema.validate(req.body);

    if (validator.error) {
      return badRequestResponse(
        res,
        'Validation error.',
        extractValidationMessage(validator.error)
      );
    }

    try {
      const data = await fileService.getSignedUrlForUpload(filename);

      return okResponse(res, 'SignedUrl generated successfully.', data);
    } catch (error) {
      console.error(error);
      return serverErrorResponse(res, 'Unable to process request.');
    }
  },

  async getDownloadUrl(req, res) {
    const filename = req.params.name;

    if (!filename) {
      return badRequestResponse(res, 'Filename field is required.');
    }

    try {
      const data = await fileService.getSignedUrlForDownload(filename);

      return okResponse(res, 'Signed URL created successfully.', data);
    } catch (error) {
      if (error instanceof FileNotFound) {
        return badRequestResponse(res, 'Filename is not valid.');
      }
      console.error(error);

      return serverErrorResponse(res, 'Unable to process request.');
    }
  }
};
