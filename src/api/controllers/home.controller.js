const { okResponse } = require('response-transformer');

module.exports = {
  home(req, res) {
    return okResponse(res, 'Hello from serverless-upload.');
  }
};
