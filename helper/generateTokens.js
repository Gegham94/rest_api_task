const client = require('../lib/redisConnect');
const { v4: uuidv4 } = require('uuid');
const { payload } = require('../config/configuration.json').jwt;
const authHelper = require('../helper/authHelper');

exports.updateTokens = async() => {

  const accessToken = await authHelper.generateAccessToken(payload);
  const refreshToken = await authHelper.generateRefreshToken(uuidv4());

  await client.set('access', accessToken);
  await client.set('refresh', refreshToken);

  return ({
    accessToken,
    refreshToken
  })
};