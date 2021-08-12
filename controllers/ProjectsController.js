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
      const project = await Project.findOne({ _id: req.params.id})

      //if project is not exist - return error
      if(!project) return next('Project is not found');

      return res.json({message: "Finded project", project });

    } catch (err){
      return next(err);
    }
};

exports.createProject = async (req, res, next) => {
  try {
    
    //create property for chechking project data before create
    const property = 'create';

    //check project data
    const checked = await valid.checkProjectInfo(req, res, next, property);

    //if project data is incorrect
    if(!checked) return res.json(checked);

    //get data for new project
    const { title, projectManager, document, developer } = req.body;

    //find project manager by id
    const manager = await User.findById({_id: projectManager});

    //find developer manager by id
    const developer = await User.findById({_id: developer});

    //if manager not found - return error
    if(!manager) return res.json({message: 'Manager not found'});

    //if user not found - return error
    if(!developer) return res.json({message: 'Developer not found'});

    // const image = req.body.image;

    //get image name
    // const imageName = await saveFile(image, imgConfPath = 'ads', res, next);

    //create new project model
    const project = new Project({
      title,
      document,
      projectManager: manager._id,
      developer: developer._id
      // image: imageName
    });

    //save new project
    const savedProject = await project.save();

    return res.json({message: 'Project created !', savedProject});

  } catch (err) {
    return next(err);
  }
};

exports.updateProject = async (req, res, next) => {
  try{

    //check project data
    const checked = await valid.checkProjectInfo(req, res, next);

    //if project data is incorrect
    if(!checked) return next('Please enter correct information')

    //get image name
    // const imageName = await saveFile(image, imgConfPath = 'ads', res, next);

    //find project by id
    const project = await Project.findById({ _id: req.params.id});
    
    //if project is not exist - return error
    if(!project) return next("Project can not updated");

    //if user change that fields , change it in project too
    if(checked.title) project.title = checked.title;
    if(checked.document) project.document = checked.document;

    //save changed project in db
    await project.save();

    return res.json({message: 'Project updated'});
    
  } catch(err){
    return next(err)
  }
};

exports.deleteProject = async (req, res, next) => {
  try{
    //check project by id
    const project = await Project.deleteOne({ _id: req.params.id});

    //if project is not exist - return error
    if(!project) return next('Project is not exist');

    return res.json({message: "Project is deleted", data: project });

  } catch (err){
    return next(err);
  }
};