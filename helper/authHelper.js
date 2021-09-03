const { payload, secretKey } = require('../config/configuration.json').jwt;
const jwt = require('jsonwebtoken');

exports.generateAccessToken = () => {
  return jwt.sign({payload}, secretKey, {
    algorithm: 'HS256',
    expiresIn: 600
  });
};

exports.generateRefreshToken = (uuidv4) => {
  return jwt.sign({uuidv4}, secretKey, {
    algorithm: 'HS256',
    expiresIn: 1200
  });
};