// Vercel serverless entry point — proxies all /api/* requests to Express
// Note: Vercel injects env vars directly into process.env, no dotenv needed
module.exports = require('../backend/server');
