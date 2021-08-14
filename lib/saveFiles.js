const { imgSync } = require('base64-img');
const { v4: uuidv4 } = require('uuid');
const { extname } = require('path');
const conf = require('../config/configuration.json')

exports.saveFile = async (image, res) => {
  try {
    //get image random unique name
    const imageNewName = uuidv4();

    let fullImageName = '';

    //image base64 to original path with unique name
    const savedImageName = await imgSync(image, `${__dirname}/${conf.media.user_original_dir}`, imageNewName);
    fullImageName = `${imageNewName}${extname(savedImageName)}`;

    console.log(fullImageName);

    return (`${fullImageName}`);

  } catch (err) {

    return res.json({message: "Image did not save", data: err });
  }
};