const User = require('../schema/User');
const valid = require('../validation/validate');
const saveFile  = require('../lib/saveFiles');

exports.getAllUsers = async(req, res, next) => {
  try{

    //check all users
    const users = await User.find({});

    //if users are not exist - return error
    if(users.length===0) return res.json({message: 'Users are not exist'});
      
    return res.json(users);

  } catch (err){
    return next(err);
  }
};

exports.getUserById = async(req, res, next) => {
  try{

    //chack user by id
    const user = await User.findById({ _id: req.params.id})

    //if user are not exist - return error
    if(users.length==0) return res.json({message: 'User is not found'});
    
    //if user finded - return user
    return res.json({message: "Here is user", data: user });
    
  }catch(err){
    return next(err);
  }
};

exports.createUser = async(req, res) => {
  try{

    //check user data
    const checked = await valid.checkUserInfo(req, res);

    if(!checked.status) return res.json(checked)

    //get user data from request
    const { email, firstName, lastName, possition, gender, dateOfBirth } = req.body;

    //get user by email
    const user = await User.findOne({email})

    //if user already exist - return info message
    if(user.length === 0) return res.json({message: `User with email ${email} already exist`});

    //call function for save image with user path
    imageName = await saveFile(req.body.image, res);

    //create user data
    const newUser = new User({
      email,
      firstName,
      lastName,
      possition,
      gender,
      dateOfBirth,
      image: imageName
    });
  
    //save user in db
    const savedUser = await newUser.save();

    if(!savedUser) {
      return new Error({ message: 'User is not saved !' });
    }else return({ message: 'User is saved !' });

  } catch (err) {
    return 'Some error occurred while creating the User';
  }
};

exports.updateUser = async(req, res) => {
  try{

    //check user data
    const checked = await valid.checkUserInfo(req, res);

    //call function for save image with user path
    //const imageName = await saveFile(req.body.image, imgConfPath = 'user', res, next);

    if(!checked.status) return res.json(checked)

    //get user id from params
    const id = req.params.id;

    User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then(data => {
        if(!data){
          res.status(404).send({message: 'User is not found !'});
        }else {
          res.status(404).send({message: 'User is updated'});
        }
      });

    return res.json({message: 'User updated'});

  } catch (err) {
    return 'Some error occurred while updating the User';
  }
};

exports.deleteUser = async(req, res, next) => {
  try{

    //get user id from params
    const id = req.params.id;

    User.findByIdAndRemove(id)
      .then(data => {
        if(!data){
          res.status(404).send({message: 'User is not found !'});
        }else {
          res.status(404).send({message: 'User is successfuly deleted'});
        }
      });
    
  }catch(err){
    return 'Some error durring delete user';
  }
};