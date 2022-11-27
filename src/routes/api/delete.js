// src/routes/api/delete.js
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

/**
 * Delete fragment by ID
 */
module.exports = async (req, res) => {
  await Fragment.delete(req.user, req.params.id)
    .then(() => {
      res.status(200).send();
    })
    .catch((err) => {
      logger.error('Something went wrong: ', { error: err });
      res.status(500).send();
    });
};
