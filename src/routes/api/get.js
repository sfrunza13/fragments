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
  if (req.query.expand == 1) {
    successResponse.fragments = await Fragment.byUser(req.user, true);
    res.status(200).json(successResponse);
  } else {
    await Fragment.byUser(req.user)
      .then((data) => {
        successResponse.fragments = data;
        res.status(200).json(successResponse);
      })
      .catch((err) => {
        logger.error('Something went wrong: ', { error: err });
        res.status(500).send();
      });
  }
};
