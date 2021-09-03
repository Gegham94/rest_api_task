const jwt = require('jsonwebtoken');
const { secretKey } = require('../config/configuration.json').jwt;
const client = require('../lib/redisConnect');
const { updateTokens } = require('../helper/generateTokens');

module.exports = async (req, res, next) => {

  //get token from request header
  const authHeader = req.get('Authorization');

  //if token does not exist - return error
  if(!authHeader) return res.json({message: 'Token is not provided !'});

  //validate token from header
  const token = authHeader.replace('Bearer ', '');

  try{
    //verify request token
    await jwt.verify(token, secretKey);

    //check access token with redis db access token
    await client.get('access', (err, result) => {
      //if error - return error
      if(err) return res.json({message: 'Some error', err});

      //if tokens are equal call next middleware
      if(token === result) return next();
    });

    //check refresh token with redis db refresh token
    await client.get('refresh', async (err, result) => {
      //if error - return error
      if(err) return res.json({message: 'Some error', err});

      //if tokens are equal call update tokens method
      if(token === result){
        const newTokens = await updateTokens();
        return res.json(newTokens);
      };
    });

  } catch (err) {
    //check error type, if token is expired - return error
    if(err instanceof jwt.TokenExpiredError) {
      return res.json({message: 'Token expired !'});
    };

    //check error type, if some error with token - return error
    if(err instanceof jwt.JsonWebTokenError){
      return res.json({message: 'Invalid token_error!'});
    };
  }
};