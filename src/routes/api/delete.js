// src/routes/api/delete.js
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

/**
 * Delete fragment by ID
 */
module.exports = (req, res) => {
  Fragment.delete(req.user, req.params.id)
    .then(() => {
      res.status(200).send('Successful Deletion!');
    })
    .catch((err) => {
      logger.error('Something went wrong in delete: %s', err);
      res.status(500).send();
    });
};
