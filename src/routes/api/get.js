// src/routes/api/get.js

const { createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

const successResponse = createSuccessResponse({
  fragments: [],
});

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  if (!req.params.id) {
    successResponse.fragments = await Fragment.byUser(req.user);
    res.status(200).json(successResponse);
  } else {
    let fragment = await Fragment.byId(req.user, req.params.id);
    res
      .status(200)
      .set('Created', fragment.created)
      .set('Updated', fragment.updated)
      .set('Content-Length', fragment.size)
      .set('Content-Type', fragment.type)
      .send(await fragment.getData());
  }
};

//.toString()
