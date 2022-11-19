const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');

/**
 * Write fragment from request body including id, created, type, size, ownerID
 * We must create a new Fragment MetaData and post it
 * setData and save (I don't know if order matters, we have email and id here)
 */
module.exports = async (req, res) => {
  //Check if it is valid JSON if Content-Type JSON
  const isJson = (str) => {
    try {
      JSON.parse(str);
    } catch (e) {
      logger.error('JSON formatting wrong: %s', e);
      let errorResponse = createErrorResponse(500, e.message);
      logger.error(errorResponse);
      res.status(500).setHeader('Location', process.env.API_URL).json(errorResponse);
      return false;
    }

    return true;
  };

  const itsGood = async () => {
    try {
      let fragment = new Fragment({
        ownerId: req.user,
        type: req.get('content-type'),
        size: +req.get('content-length'),
      });

      await fragment.save();
      await fragment.setData(req.body);

      const successResponse = createSuccessResponse({
        fragment: fragment,
      });

      res
        .status(201)
        .setHeader('Location', process.env.API_URL + '/' + fragment.id)
        .json(successResponse);
    } catch (err) {
      logger.error('Server error ', { error: err });
      res.status(500).setHeader('Location', process.env.API_URL).json(err);
    }
  };

  //Check if content type is supported
  if (!Fragment.isSupportedType(req.get('content-type'))) {
    let errorResponse = createErrorResponse(415, 'Content Type not supported');
    res.status(415).json(errorResponse);
  } else if (req.get('content-type') === 'application/json') {
    if (isJson(req.body)) {
      itsGood();
    }
  } else {
    itsGood();
  }
};
