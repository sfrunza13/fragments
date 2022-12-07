// src/routes/api/getById.js
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

/**
 * Get a particular fragment for the current user by Id
 * Try converting it to the extension if there is one
 */
module.exports = async (req, res) => {
  if (req.params.id.includes('.')) {
    //Conversion here if you can
    try {
      let convertArray = req.params.id.split('.');
      console.log(convertArray);
      let typeToConvert = Fragment.dealWithExtension(convertArray[1]);
      logger.info('This is the extension: %s', typeToConvert);
      let fragment = await Fragment.byId(req.user, convertArray[0]);
      try {
        let converted = await fragment.conversionLogic(typeToConvert);
        res.status(200).setHeader('Content-Type', typeToConvert).send(converted);
      } catch (err) {
        logger.error('Not a convertable type for %s', fragment.type);
        logger.error('Error converting: %s', err);
        res.status(415).send();
      }
    } catch (err) {
      logger.error('Fragment %s not found', req.params.id);
      res.status(404).send();
    }
  }

  Fragment.byId(req.user, req.params.id)
    .then(async (fragment) => {
      res
        .status(200)
        .setHeader('Content-Type', fragment.type)
        .send(await fragment.getData());
    })
    .catch((err) => {
      logger.error('Something went wrong in getByID: %s', err);
      res.status(404).send();
    });
};
