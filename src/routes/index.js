// src/routes/index.js

const express = require('express');

// version and author from package.json
const { version, author } = require('../../package.json');

// Create a router that we can use to mount our API
const router = express.Router();

// Our authorization middleware
const { authenticate } = require('../authorization');

// Add responses
const { createSuccessResponse } = require('../../src/response');

/**
 * Expose all of our API routes on /v1/* to include an API version.
 * Protect them all so you have to be authenticated in order to access.
 */
router.use(`/v1`, authenticate(), require('./api'));

/**
 * Define a simple health check route. If the server is running
 * we'll respond with a 200 OK.  If not, the server isn't healthy.
 */
router.get('/', (req, res) => {
  // Client's shouldn't cache this response (always request it fresh)
  res.setHeader('Cache-Control', 'no-cache');
  // Send a 200 'OK' response

  const stat = createSuccessResponse({
    author: author,
    githubUrl: 'https://github.com/sfrunza13/fragments',
    version: version,
  });

  res.status(200).json({
    ...stat,
  });
});

module.exports = router;
