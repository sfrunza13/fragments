// src/routes/api/getById.js
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const md = require('markdown-it')();
/**
 * Get a particular fragment for the current user by Id
 * Try converting it to the extension if there is one
 */
module.exports = async (req, res) => {
  if (req.params.id.includes('.')) {
    //Conversion here if you can

    let convertArray = req.params.id.split('.');
    let typeToConvert = dealWithExtension(convertArray[1]);
    logger.info('This is the extension: %s', typeToConvert);
    await Fragment.byId(req.user, convertArray[0]).then(async (fragment) => {
      //fragment.formats is not a function
      if (fragment.formats.includes(typeToConvert)) {
        let converted;
        if (typeToConvert === 'text/html') {
          converted = md.render((await fragment.getData()).toString());
        } else {
          converted = await fragment.getData();
        }
        res.status(200).setHeader('Content-Type', typeToConvert).send(converted);
      } else {
        logger.error('Not a convertable type for %s', fragment.type);
        res.status(500).send();
      }
    });
  }

  await Fragment.byId(req.user, req.params.id)
    .then(async (fragment) => {
      res
        .status(200)
        .setHeader('Content-Type', fragment.type)
        .send(await fragment.getData());
    })
    .catch((err) => {
      logger.error('Something went wrong: ', { error: err });
      res.status(404).send();
    });
};

function dealWithExtension(ext) {
  //Take extension and spit out content/subcontent
  let type;
  switch (ext) {
    case 'txt':
      type = 'text/plain';
      break;
    case 'md':
      type = 'text/markdown';
      break;
    case 'html':
      type = 'text/html';
      break;
    case 'json':
      type = 'application/json';
      break;

    default:
      break;
  }
  return type;
}
