const express = require('express');
const app = express();
const routes = require('./api/routes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

module.exports = app;
