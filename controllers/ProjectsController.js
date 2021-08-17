const Project = require('../schema/Project');
const User = require('../schema/User');
const Document = require('../schema/Document')
const valid = require('../validation/validate');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

exports.getAllProjects = async (req, res, next) => {
    try{

      //check all projects
      const projects = await Project.find({});
      console.log(projects)

      //if project are not exist - return error
      if(projects.length === 0) return res.json({message: 'Projects are not found'});
      
      return res.json(projects);

    } catch (err){
      return next(err);
    }
};

exports.getProjectById = async(req, res, next) => {
    try{

      //check project by id
      const project = await Project.findById({ _id: req.params.id})

      //if project is not exist - return error
      if(project.length === 0) return next('Project is not found');

      return res.json({message: "Here is project", project });

    } catch (err){
      return next(err);
    }
};

exports.createProject = async (req, res, next) => {
  try {

    //check project data
    const checked = await valid.checkProjectInfo(req, res);

    //if project data is incorrect
    if(!checked) return res.json(checked);

    //get data for new project
    const { title } = req.body;

    var docData = fs.readFileSync(`${__dirname}/${conf.media.user_image_dir}/default.pdf`);

    const document = new Document({
			type: 'plain/text',
			data: docData
		});

    const newDocUniqueName = uuidv4();

    // Store the Document to the MongoDB
		document.save()
		.then(doc => {
			console.log("Saved an document 'default.pdf' to MongoDB.");

			Image.findById(doc, (err, findOutDoc) => {
				if (err) throw err;
				try{
					fs.writeFileSync(`${__dirname}/${conf.media.user_image_dir}/documents/${newDocUniqueName}.pdf`, findOutDoc.data);

					process.exit(0);
				}catch(e){
					console.log(e);
				}
			});
		}).catch(err => {
			console.log(err);
			throw err;
		});

    //create new project model
    const project = new Project({
      title,
      document: document,
      manager,
      developer
    });

    //save new project
    const savedProject = await project.save();

    return res.json({message: 'Project created !', savedProject});

  } catch (err) {
    return next(err);
  }
};

exports.assignProjectManager = async (req, res, next) => {
  try{

    // get user for updateing
    const {email} = req.body;

    // find user by Email
    const user = await User.findOne({email});

    //if user is not exist - return error
    if(user.length === 0) return res.json({message: "User is not found"});

    const id = req.params.id;

    Project.findByIdAndUpdate({_id: id},
      {
        $set: {
          manager: user
        }
      },
      (err, data) => {
        if(err) return res.json(err);
        return res.json({message: 'Manager is assigned', data});
      }
    );

  } catch(err){
    return next(err);
  }
};

exports.assignProjectDeveloper = async (req, res, next) => {
  try{

    // get user for updateing
    const {email} = req.body;

    // find user by Email
    const user = await User.findOne({email});

    //if user is not exist - return error
    if(user.length === 0) return res.json({message: "User is not found"});

    Project.findByIdAndUpdate({_id: id},
      {
        $set: {
          developer: user
        }
      },
      (err, data) => {
        if(err) return res.json(err);
        return res.json({message: 'Developer is assigned', data});
      }
    );

  } catch(err){
    return next(err)
  }
};

exports.deleteProject = async (req, res) => {
  try{

    //get project id from params
    const id = req.params.id;

    await Project.findOne({_id: id})
      .then(data => {
        if(!data){
          res.status(404).send({message: 'Project is not found !'});
        }else {
          res.status(404).send({message: 'Project is successfuly deleted'});
        }
      });

  } catch (err){
    return 'Some error durring delete project';
  }
};