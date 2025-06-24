// index.js
const serverless = require('serverless-http');
const app = require('../app'); // ✅ CORRECT


module.exports.handler = serverless(app);
