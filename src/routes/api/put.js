const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const { createSuccessResponse, createErrorResponse } = require('../../response');

module.exports = async (req, res) => {
  let fragmentToUpdate;
  let errorResponse;

  //Tries to retrieve a fragment's data
  try {
    fragmentToUpdate = await Fragment.byId(req.user, req.params.id);

    //Check content-type match

    if (req.get('content-type') != fragmentToUpdate.type) {
      errorResponse = createErrorResponse(
        400,
        "A fragment's type can not be changed after it is created."
      );
      res.status(400).json(errorResponse);
    } else {
      //the only thing that should change is updated and size
      //and update is changed in save method anyways
      fragmentToUpdate.size = +req.get('content-length');

      await fragmentToUpdate.setData(req.body);
      await fragmentToUpdate.save();

      const successResponse = createSuccessResponse({
        fragment: fragmentToUpdate,
      });

      res
        .status(201)
        .setHeader('Location', process.env.API_URL + '/' + fragmentToUpdate.id)
        .json(successResponse);
    }
  } catch (err) {
    logger.error('Something went wrong fetching the fragment to UPDATE: %s', err);
    errorResponse = createErrorResponse(
      404,
      'A fragment can not be retrieved by this ID: ' + req.params.id
    );
    res.status(404).json(errorResponse);
  }
};
