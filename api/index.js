// Vercel serverless entry point — proxies all /api/* requests to Express
require('dotenv').config({ path: require('path').join(__dirname, '../backend/.env') });
module.exports = require('../backend/server');
