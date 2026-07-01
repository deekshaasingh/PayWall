const express = require('express');
const cors = require('cors');
const auths = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', auths);
app.use('/admin', adminRoutes);

module.exports = app;