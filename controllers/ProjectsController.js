const Project = require('../schema/Project');
const User = require('../schema/User');
const valid = require('../validation/validate');

// const { saveFile } = require('../lib/saveFile');

exports.getAllProjects = async (req, res, next) => {
    try{

      //check all projects
      const projects = await Project.find({});

      //if project are not exist - return error
      if(!projects) return res.json({message: 'Projects are not found'});
      
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
      if(!project) return next('Project is not found');

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
    const { title, projectManager, document, developer } = req.body;

    //find project manager by id
    const manager = await User.findById({_id: projectManager});

    //find developer manager by id
    const dev = await User.findById({_id: developer});

    //if manager not found - return error
    if(!manager) return res.json({message: 'Manager is not found'});

    //if user not found - return error
    if(!dev) return res.json({message: 'Developer is not found'});

    //get image name
    // const imageName = await saveFile(image, imgConfPath = 'ads', res, next);

    //create new project model
    const project = new Project({
      title,
      document,
      projectManager: manager._id,
      developer: dev._id
    });

    //save new project
    const savedProject = await project.save();

    return res.json({message: 'Project created !', savedProject});

  } catch (err) {
    return next(err);
  }
};

exports.updateProjectManager = async (req, res, next) => {
  try{

    // find user by Email
    const user = await User.findOne(req.body.email);

    //if user is not exist - return error
    if(!user) return res.json({message: "User is not found"});

    Project.findByIdAndUpdate(req.params.id,
      {
        $set: {
          projectManager: user
        }
      },
      (err, data) => {
        if(err) return res.json(err);
        return res.json({message: 'Manager is updated', data});
      }
    );

  } catch(err){
    return next(err)
  }
};

exports.updateProjectDeveloper = async (req, res, next) => {
  try{

    // find user by Email
    const user = await User.findOne(req.body.email);

    //if user is not exist - return error
    if(!user) return res.json({message: "User is not found"});

    Project.findByIdAndUpdate(req.params.id,
      {
        $set: {
          developer: user
        }
      },
      (err, data) => {
        if(err) return res.json(err);
        return res.json({message: 'Developer is updated', data});
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

    Project.findByIdAndRemove(id)
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