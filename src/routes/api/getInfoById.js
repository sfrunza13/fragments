// src/routes/api/getInfoById.js

const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const { createSuccessResponse } = require('../../response');

/**
 * Get a particular fragment metadata for the current user by ID
 */
module.exports = async (req, res) => {
  await Fragment.byId(req.user, req.params.id)
    .then(async (fragment) => {
      let successResponse = createSuccessResponse({ fragment: fragment });
      res.status(200).set('Content-Type', fragment.type).json(successResponse);
    })
    .catch((err) => {
      logger.error('Something went wrong: ', { error: err });
      res.status(500).send();
    });
};
