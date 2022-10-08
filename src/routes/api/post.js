const { Fragment } = require('../../model/fragment');
const { createSuccessResponse } = require('../../response');

/**
 * Write fragment from request body including id, created, type, size, ownerID
 * We must create a new Fragment MetaData and post it
 * setData and save (I don't know if order matters, we have email and id here)
 */
module.exports = async (req, res) => {
  // console.log('This is my request header: ', req.headers);

  // console.log('This is my request body: ', req.body);

  // console.log('testing real quick: ', req.get('content-type'));

  // console.log(req.user);

  let fragment = new Fragment({
    ownerId: req.user,
    type: req.get('content-type'),
    size: +req.get('content-length'),
  });

  await fragment.save();
  await fragment.setData(req.body);

  const successResponse = createSuccessResponse({
    Fragment: fragment,
  });

  res.status(201).setHeader('Location', process.env.API_URL).json(successResponse);
};
