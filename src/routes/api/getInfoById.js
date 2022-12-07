// src/routes/api/getInfoById.js

const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const { createSuccessResponse } = require('../../response');

/**
 * Get a particular fragment metadata for the current user by ID
 */
module.exports = (req, res) => {
  Fragment.byId(req.user, req.params.id)
    .then((fragment) => {
      let successResponse = createSuccessResponse({ fragment: fragment });
      res.status(200).set('Content-Type', fragment.type).json(successResponse);
    })
    .catch((err) => {
      logger.error('Something went wrong in getInfoByID: %s', err);
      res.status(500).send();
    });
};
