const User = require('../schema/User');
const valid = require('../validation/validate');
const { saveFile } = require('../lib/saveFiles');

exports.getAllUsers = async(req, res, next) => {
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

exports.createUser = async(req, res) => {
  try{

    //create property for chechking user data before create
    const property = 'create';

    //check user data
    const checked = await valid.checkUserInfo(req, res, property);

    if(!checked) return res.json(checked)

    //get user data from request
    const { email, firstName, lastName, possition, gender, image } = req.body;

    // String newFileName = "my-image";
    // File imageFile = new File("/users/victor/images/image.png");
    // GridFS gfsPhoto = new GridFS(db, "photo");
    // GridFSInputFile gfsFile = gfsPhoto.createFile(imageFile);
    // gfsFile.setFilename(newFileName);
    // gfsFile.save();

    //call function for save image with user path
    const imageName = await saveFile(image, res);

    //create user data
    const newUser = new User({
      email,
      firstName,
      lastName,
      possition,
      gender,
      image: imageName
    });

    //get user by email
    const user = await User.findOne({email})

    //if user already exist - return info message
    if(user) return res.json({message: `User with email ${email} already exist`});
  
    //save user in db
    const savedUser = await newUser.save();
    if(!savedUser) return new Error({ message: 'User are not saved !' });

    //call email sender function

  } catch (err) {
    return res.json({message: err.message, data: err });
  }
};

exports.updateUser = async(req, res, next) => {
  try{

    //check user data
    const checked = await valid.checkUserInfo(req, res, next);

    if(!checked) return res.json(checked)

    const user = await User.findOne({email});

    //if user already exist - return info message
    if(!user) return res.json({message: 'User not found !'});

    //if user change that fields , change it in user too
    if(checked.firstName) user.firstName = checked.firstName;
    if(checked.lastName) user.lastName = checked.lastName;
    if(checked.possition) user.possition = checked.possition;
    if(checked.gender) user.gender = checked.gender;
    if(checked.image) user.image = checked.image;
    
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
    const { email } = req.body;

    //chack user by id
    const user = await User.findOne({ email })

    //if user are not exist - return error
    if(!user) return res.json({message: 'User not found-email'});

    //delete user from db
    const deletedUser = await user.delete({});
    if(!deletedUser) return res.json({message: 'User are not deleted'});
    
    //if user finded - return user
    return res.json({message: "User are successfuly deleted"});
    
  }catch(err){
    return next(err);
  }
};