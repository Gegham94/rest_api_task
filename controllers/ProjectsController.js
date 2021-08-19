const Project = require('../schema/Project');
const User = require('../schema/User');
const Document = require('../schema/Document')
const valid = require('../validation/validate');
const conf = require('../config/configuration.json')
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

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
    const { title , manager , developer } = req.body;

    var docData = fs.readFileSync(`${__dirname}/${conf.media.directory}/default.pdf`);

    const document = new Document({
			type: 'plain/text',
			data: docData
		});

    const newDocUniqueName = uuidv4();

    // Store the Document to the MongoDB
		document.save()
		.then(doc => {
			Document.findById(doc, (err, findOutDoc) => {
				if (err) throw err;
				try{
					fs.writeFileSync(`${__dirname}/${conf.media.directory}/documents/${newDocUniqueName}.pdf`, findOutDoc.data);

					process.exit(0);
				}catch(err){
					return res.json({message: "Error", data: err});
				}
			});
		}).catch(err => {
			return res.json({message: "Error", data: err})
		});

    //create new project model
    const project = new Project({
      title,
      document: document,
      manager,
      developer
    });

    //save new project
    await project.save()
      .then(savedProject => {
        return res.json({ message: 'Project is saved', data: savedProject});
      }).catch( err => {
        return res.json({ message: 'Project is nod saved !', data: err });
      });

  } catch (err) {
    return res.json({ message: 'Some error occurred while creating the Project', data: err });
  }
};

exports.assignProjectManager = async (req, res, next) => {
  try{

    // get user for updateing
    const {email} = req.body;

    // find user by Email
    const user = await User.findOne({email});

    //if user is not exist - return error
    if(!user) return res.json({message: "User is not found"});

    const id = req.params.id;

    Project.findByIdAndUpdate({_id: id},
      {
        $set: {
          manager: user
        }
      },
      (err) => {
        if(err) return res.json(err);
        return res.json({message: 'Manager is assigned'});
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
    if(!user) return res.json({message: "User is not found"});

    const id = req.params.id;

    Project.findByIdAndUpdate({_id: id},
      {
        $set: {
          developer: user
        }
      },
      (err) => {
        if(err) return res.json(err);
        return res.json({message: 'Developer is assigned'});
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

    Project.findByIdAndRemove({ _id: id})
      .then(data => {
        if(!data){
          return res.status(404).send({message: 'Project is not found !'});
        }else {
          return res.status(404).send({message: 'Project is successfuly deleted'});
        }
      });

  } catch (err){
    return res.json({message: 'Some error durring delete project', data: err});
  }
};