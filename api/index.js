const express = require('express');
const app = express();
const serverless = require('serverless-http');

// Setup your Express app (routes, DB, etc.)
app.set('view engine', 'ejs');
// your other middleware and routes

module.exports.handler = serverless(app);
