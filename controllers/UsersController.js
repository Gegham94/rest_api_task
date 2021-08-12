const User = require('../schema/User');
const valid = require('../validation/validate');
// const { saveFile } = require('../lib/saveFile');

exports.getUsers = async(req, res, next) => {
  try{

    //check all users
    const users = await User.find({});

    //if users are not exist - return error
    if(!users) return res.json({message: 'Users are not exist'});
      
    return res.json(users);

  } catch (err){
    return next(err);
  }
};

exports.getUserById = async(req, res, next) => {
  try{

    //chack user by id
    const user = await User.findOne({ _id: req.params.id})

    //if user are not exist - return error
    if(!user) return res.json({message: 'User not found'});
    
    //if user finded - return user
    return res.json({message: "Finded user", data: user });
    
  }catch(err){
    return next(err);
  }
};

exports.createUser = async(req, res, next) => {
  try{

    //create property for chechking user data before create
    const property = 'create';

    //check user data
    const checked = await valid.checkUserInfo(req, res, next, property);

    if(!checked) return res.json(checked)

    //get user data from request
    const { firstName, surname, lastName, nickName, address, email, password, image } = req.body;

    // //call function for save image with user path
    // const imageName = await saveFile(image, imgConfPath = 'user', res, next);

    //create user data
    const newUser = new User({
      firstName,
      surname,
      lastName,
      nickName,
      address,
      email,
      password,
      // image: imageName
    });

    //get user by email
    const user = await User.findOne({email})

    //if user already exist - return info message
    if(user) return res.json({message: `User with email ${email} already exist`});
  
    //save user in db
    const savedUser = await newUser.save();
    if(!savedUser) return new Error({ message: 'User are not saved !' });

    //call email sender function
    await verifyEmailTemplate.sendEmail(req, res, next, email, nickName);

  } catch (err) {
    return next(err);
  }
};

exports.updateUser = async(req, res, next) => {
  try{

    //check user data
    const checked = await valid.checkUserInfo(req, res, next);

    if(!checked) return res.json(checked)
    console.log(checked)

    const user = await User.findById({_id: req.body.id});

    //if user already exist - return info message
    if(!user) return res.json({message: 'User not found !'});

    //if user change that fields , change it in user too
    if(checked.firstName) user.firstName = checked.firstName;
    if(checked.surname) user.surname = checked.surname;
    if(checked.lastName) user.lastName = checked.lastName;
    if(checked.nickName) user.nickName = checked.nickName;
    if(checked.address) user.address = checked.address;
    
    //call function for save image with user path
    // const imageName = await saveFile(image, imgConfPath = 'user', res, next);
  
    //save user in db
    await user.save();

    return res.json({message: 'User updated'});

  } catch (err) {
    return next(err);
  }
};

exports.deleteUser = async(req, res, next) => {
  try{

    //get data from user
    const { email, password } = req.body;

    //chack user by id
    const user = await User.findOne({ email })

    //if user are not exist - return error
    if(!user) return res.json({message: 'User not found-email'});

    //if enter wrong password
    if(!user.checkPassword(password)) return res.json({ message: `Incorrect Password !`});

    //delete user from db
    const deletedUser = await user.delete({});
    if(!deletedUser) return res.json({message: 'User are not deleted'});
    
    //if user finded - return user
    return res.json({message: "User are successfuly deleted"});
    
  }catch(err){
    return next(err);
  }
};

exports.loginUser = async (req, res, next) => {
  try {

    //get data from user
    const {email, password} = req.body;

    //find user by email
    const user = await User.findOne({email});

    //if user does not exist or enter wrong fields - return error
    if(!user || !user.checkPassword(password)) return res.json({ message: `Incorrect Email or Password !`});
  
    //generate secret token
    const token = await updateTokens();

    //if token does not creatid - return error
    if(!token) return res.json({message: 'Token does not created !'});

    return res.json({message: 'Login is succesfuly done', token, userId: user._id});
    
  } catch (error) {
    return next(error);
  }
};