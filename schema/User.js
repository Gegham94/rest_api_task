const { Schema, model } = require('../lib/dbConnect');
const crypto = require('crypto');

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  possition: {
    type: String,
    required: true,
    trim: true,
  },
  gender: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  IsEmailVerify: {
    type: Boolean,
    default: false
  },
  passwordHash: {
    type: String,
  },
  salt: {
    type: String
  },
});

userSchema.virtual('password')
  .set(function(password){
    if(password !== undefined) {
      if(password.length < 6) {
        this.invalidate('password', 'Password must be minimum 6 symbols');
      }
    }

    this._plainPassword = password;

    if(password) {
      this.salt = crypto.randomBytes(16).toString('base64');
      this.passwordHash = crypto.pbkdf2Sync(
        password,
        this.salt,
        100,
        16,
        'sha256'
      ).toString('base64');
    } else {
      this.salt = undefined;
      this.passwordHash = undefined;
    }
  })
  .get(function(){
    return this._plainPassword
  });

userSchema.methods.checkPassword = function(password){
  if(!password) return false;
  if(!this.passwordHash) return false;

  return crypto.pbkdf2Sync(
    password,
    this.salt,
    100,
    16,
    'sha256'
  ).toString('base64') === this.passwordHash;
};

module.exports = model('User', userSchema);