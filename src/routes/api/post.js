const { createSuccessResponse } = require('../../response');

/**
 * Get a list of fragments for the current user
 */
module.exports = (req, res) => {
  const successResponse = createSuccessResponse({
    message: 'Yoopie!',
    payload: req.body,
  });

  // TODO: this is just a placeholder to get something working...
  res.status(201);
  res.setHeader('Location', process.env.API_URL);
  res.json(...successResponse);
  res.end();
};

// const stat = createSuccessResponse({
//   author: author,
//   githubUrl: 'https://github.com/sfrunza13/fragments',
//   version: version,
// });

// res.status(200).json({
//   ...stat,
// });
