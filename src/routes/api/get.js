// src/routes/api/get.js

const { createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

const successResponse = createSuccessResponse({
  fragments: [],
});

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  if (!req.params.id) {
    await Fragment.byUser(req.user)
      .then((data) => {
        successResponse.fragments = data;
        res.status(200).json(successResponse);
      })
      .catch((err) => {
        logger.error('Something went wrong: ', err);
      });
  } else {
    await Fragment.byId(req.user, req.params.id)
      .then(async (fragment) => {
        res
          .status(200)
          .set('Created', fragment.created)
          .set('Updated', fragment.updated)
          .set('Content-Length', fragment.size)
          .set('Content-Type', fragment.type)
          .send(await fragment.getData());
      })
      .catch((err) => {
        logger.error('Something went wrong: ', err);
      });
  }
};
