const User = require('../schema/User');
const valid = require('../validation/validate');
const fs = require('fs');
const conf = require('../config/configuration.json');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

exports.getAllUsers = async(req, res, next) => {
  try{
    const users = await User.find({});
    if(!users) return res.json({message: 'Users are not exist'});
      
    return res.json(users);

  } catch (err){
    return next(err);
  }
};

exports.getUserById = async(req, res, next) => {
  try{
    const user = await User.findById({ _id: req.params.id})
    if(!user) return res.json({message: 'User is not found'});
    return res.json({message: "User", data: user });
    
  }catch(err){
    return next(err);
  }
};

exports.createUser = async(req, res) => {
  try{
    const checked = await valid.checkUserInfo(req, res);
    if(!checked.status) return res.json(checked)

    const { email, firstName, lastName, possition, gender, dateOfBirth } = req.body;
    const user = await User.findOne({email: email})
    if(user) return res.json({message: `User with email ${email} already exist`});

    const match = ["image/png", "image/jpeg", "image/jpg"];
    if(match.indexOf(req.file.mimetype) === -1){
      return res.json({status: 'Fail', message: 'Incorrect image type'})
    } 

    const newImageUniqueName = uuidv4();
    fs.writeFileSync(`${conf.media.directory}/images/${newImageUniqueName}${path.extname(req.file.originalname)}`, req.file.buffer);

    const newUser = new User({
      email,
      firstName,
      lastName,
      possition,
      gender,
      dateOfBirth,
      image: `http://localhost:3000/${conf.media.directory}/images/${newImageUniqueName}${path.extname(req.file.originalname)}`
    });
  
    await newUser.save()
      .then(savedUser => {
        return res.json({ message: 'User is saved', data: savedUser});
      }).catch(err => {
        return res.json({ message: 'User is nod saved !', data: err });
      });

  } catch (err) {
    return res.json({ message: 'Some error occurred while creating the User', data: err });
  }
};

exports.updateUser = async(req, res) => {
  try{
    const checked = await valid.checkUserInfo(req, res);
    if(!checked.status) return res.json(checked)

    const id = req.params.id;
    User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then(data => {
        if(!data){
          return res.status(404).send({message: 'User is not found !'});
        }else {
          return res.status(404).send({message: 'User is updated', data});
        }
      }).catch(err => {
        res.json({message: "Error", data: err})
        throw err;
      });

  } catch (err) {
    return res.json({ message: 'Some error occurred while updating the User', data: err });
  }
};

exports.deleteUser = async(req, res) => {
  try{
    const id = req.params.id;

    User.findByIdAndRemove({ _id: id})
      .then(data => {
        if(!data){
          return res.status(404).send({message: 'User is not found !'});
        }else {
          return res.status(404).send({message: 'User is successfuly deleted'});
        }
      });
    
  }catch(err){
    return res.json({ message: 'Some error durring delete User', data: err });
  }
};