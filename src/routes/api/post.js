const { createSuccessResponse } = require('../../response');

const successResponse = createSuccessResponse({
  message: 'Yoopie!',
});
// const Fragment = require("../../model/fragment")
/**
 * Write fragment from request body including id, created, type, size, ownerID
 * We must create a new Fragment MetaData and post it
 * setData and save (I don't know if order matters, we have email and id here)
 */
module.exports = (req, res) => {
  // const fragment = new Fragment();

  // fragment.

  // TODO: this is just a placeholder to get something working...
  res.status(201).setHeader('Location', process.env.API_URL).json(successResponse);
};

// const stat = createSuccessResponse({
//   author: author,
//   githubUrl: 'https://github.com/sfrunza13/fragments',
//   version: version,
// });

// res.status(200).json({
//   ...stat,
// });
