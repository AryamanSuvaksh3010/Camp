const express = require('express');
const app = express();
const serverless = require('serverless-http');

// Setup your Express app (routes, DB, etc.)
app.set('view engine', 'ejs');
// your other middleware and routes

module.exports.handler = serverless(app);
const app = require('./app');
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serving on port ${PORT}`);
});

