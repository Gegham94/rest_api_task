const { imgSync } = require('base64-img');
const { v4: uuidv4 } = require('uuid');
const { extname } = require('path');
const conf = require('../config/configuration.json');

exports.saveFile = async (image, res) => {
  try {

    //create image random unique name
    const imageNewName = uuidv4();

    //get image extension
    const imageType = image.split(';')[0].split('/')[1].toLowerCase();

    //if image extension is not correct - return error
    if (imageType !== 'jpeg' && imageType !== 'jpg' && imageType !== 'png') {
      throw new Error('Image extension type error');
    };

    let fullImageName = '';

    //image base64 to original path with unique name
    const savedImageName = imgSync(image, `${__dirname}/${conf.media.user_image_dir}`, imageNewName);
    fullImageName = `${imageNewName}${extname(savedImageName)}`;

    return (`${fullImageName}`);

  } catch (err) {

    return "Image did not save";
  }
};