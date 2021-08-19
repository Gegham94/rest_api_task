const User = require('../schema/User');
const valid = require('../validation/validate');
const Image = require('../schema/Image');
const conf = require('../config/configuration.json')
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

exports.getAllUsers = async(req, res, next) => {
  try{

    //check all users
    const users = await User.find({});

    //if users are not exist - return errornodemon
    if(!users) return res.json({message: 'Users are not exist'});
      
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
    if(!user) return res.json({message: 'User is not found'});
    
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
    const user = await User.findOne({email: email})

    //if user already exist - return info message
    if(user) return res.json({message: `User with email ${email} already exist`});

    var imageData = fs.readFileSync(`${__dirname}/${conf.media.directory}/default.jpg`);

    const image = new Image({
			type: 'image/jpg',
			data: imageData
		});

    const newImageUniqueName = uuidv4();

    // Store the Image to the MongoDB
		image.save()
		.then(img => {
			console.log("Saved an image 'default.jpg' to MongoDB.");
      
			Image.findById(img, (err, findOutImage) => {
				if (err) throw err;
				try{

					fs.writeFileSync(`${__dirname}/${conf.media.directory}/images/${newImageUniqueName}.jpg`, findOutImage.data);
					process.exit(0);

				}catch(err){
					res.json({message: "Error", data: err});
				}
			});
		}).catch(err => {
			res.json({message: "Error", data: err});
			throw err;
		});

    //create user data
    const newUser = new User({
      email,
      firstName,
      lastName,
      possition,
      gender,
      dateOfBirth,
      image: image
    });
  
    //save user in db
    const savedUser = await newUser.save();

    if(savedUser) {
      return res.json({ message: 'User is saved', data: savedUser});
    }else return res.json({ message: 'User is nod saved !', data: savedUser });

  } catch (err) {
    return res.json({ message: 'Some error occurred while creating the User', data: err });
  }
};

exports.updateUser = async(req, res) => {
  try{

    //check user data
    const checked = await valid.checkUserInfo(req, res);

    if(!checked.status) return res.json(checked)

    //get user id from params
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

    //get user id from params
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