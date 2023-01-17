const express = require('express');
const homeController = require('./controllers/home.controller');
const fileController = require('./controllers/file.controller');
const { notFoundResponse } = require('response-transformer');
const router = express.Router();

router.get('/', homeController.home);
router.post('/signed-url/generate', fileController.getUploadUrl);
router.get('/signed-url/:name', fileController.getDownloadUrl);

router.use((req, res, next) => {
  return notFoundResponse(res, 'Resource not found.');
});

module.exports = router;
