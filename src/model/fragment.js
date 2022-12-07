// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');
const md = require('markdown-it')();
const sharp = require('sharp');
const logger = require('../logger');

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

class Fragment {
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    if (!ownerId) throw Error('No OwnerID');
    if (!type) throw Error('No Type');

    this.ownerId = ownerId;
    this.type = type;

    if (id !== undefined) {
      this.id = id;
    } else {
      this.id = randomUUID();
    }

    if (created) {
      this.created = created;
    } else {
      this.created = new Date().toISOString();
    }

    if (updated) {
      this.updated = updated;
    } else {
      this.updated = new Date().toISOString();
    }

    if (typeof size != 'number') throw Error('Size is not of Type Number');
    if (size < 0) throw Error('Size can not be negative');
    if (!Fragment.isSupportedType(type)) throw Error('Type is not supported');
    this.size = size;
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    return listFragments(ownerId, expand);
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    const result = await readFragment(ownerId, id);
    if (result === undefined) throw Error(id + ' returns undefined');

    const fragment = new Fragment(result);

    return fragment;
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise
   */
  static delete(ownerId, id) {
    return deleteFragment(ownerId, id);
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise
   */
  save() {
    this.updated = new Date().toISOString();
    return writeFragment(this);
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  getData() {
    return readFragmentData(this.ownerId, this.id);
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise
   */
  async setData(data) {
    if (!Buffer.isBuffer(data)) {
      throw Error(data + ' is not a buffer');
    }
    //this is incorrect
    this.size = data.length;
    this.save();
    return writeFragmentData(this.ownerId, this.id, data);
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    if (this.mimeType.substring(0, 4) == 'text') {
      return true;
    }
    return false;
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    let formats = [];
    switch (this.mimeType) {
      case 'text/plain':
        formats = ['text/plain'];
        break;
      case 'text/markdown':
        formats = ['text/plain', 'text/html', 'text/markdown'];
        break;
      case 'text/html':
        formats = ['text/plain', 'text/html'];
        break;
      case 'application/json':
        formats = ['text/plain', 'application/json'];
        break;
      case 'image/png':
        formats = ['image/jpeg', 'image/webp', 'image/gif', 'image/png'];
      case 'image/jpeg':
        formats = ['image/jpeg', 'image/webp', 'image/gif', 'image/png'];
      case 'image/webp':
        formats = ['image/jpeg', 'image/webp', 'image/gif', 'image/png'];
      case 'image/gif':
        formats = ['image/jpeg', 'image/webp', 'image/gif', 'image/png'];
      default:
        break;
    }
    return formats;
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    let supportedTypes = [
      'text/plain',
      'text/markdown',
      'text/html',
      'application/json',
      'image/png',
      'image/jpeg',
      'image/webp',
      'image/gif',
    ];
    let pos = value.indexOf(';');
    let baseType = '';

    if (pos == -1) {
      baseType = value;
    } else {
      baseType = value.substring(0, pos);
    }
    return supportedTypes.includes(baseType);
  }

  static dealWithExtension(ext) {
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
      case 'png':
        type = 'image/png';
        break;
      case 'jpg':
        type = 'image/jpeg';
        break;
      case 'jpeg':
        type = 'image/jpeg';
        break;
      case 'webp':
        type = 'image/webp';
        break;
      case 'gif':
        type = 'image/gif';
      default:
        break;
    }
    return type;
  }

  async conversionLogic(typeToConvert) {
    //fragment.formats is not a function
    if (this.formats.includes(typeToConvert)) {
      let converted;
      if (typeToConvert === 'text/html') {
        converted = md.render((await this.getData()).toString());
      } else if (typeToConvert.includes('image/')) {
        let typeArr = typeToConvert.split('/');
        logger.info('EXTENSIONS: %s', typeArr[1]);
        let data = await this.getData();

        try {
          converted = await sharp(data).toFormat(typeArr[1]).toBuffer();
        } catch (err) {
          logger.error('ERROR CONVERTING WITH SHARP: %s', err);
          throw Error('Error converting image with Sharp');
        }
      } else {
        converted = await this.getData();
      }
      return converted;
    } else {
      logger.error('Not a convertable type for %s', this.type);
      throw Error('It seems conversion does not work between these types');
    }
  }
}

module.exports.Fragment = Fragment;
