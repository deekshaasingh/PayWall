const express = require('express');
const auths = require('./routes/auth.routes');

const app = express();

app.use(express.json());

app.use('/', auths);

module.exports = app;