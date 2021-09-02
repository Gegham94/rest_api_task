const Project = require('../schema/Project');
const User = require('../schema/User');
const valid = require('../validation/validate');
const fs = require('fs');
const conf = require('../config/configuration.json');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

exports.getAllProjects = async (req, res, next) => {
  try{

    const projects = await Project.find({});
    if(!projects) return res.json({message: 'Projects are not found'});
    
    return res.json(projects);

  } catch (err){
    return next(err);
  }
};

exports.getProjectById = async(req, res, next) => {
  try{

    const project = await Project.findById({ _id: req.params.id})
    if(!project) return next('Project is not found');

    return res.json({message: "Here is project", project });

  } catch (err){
    return next(err);
  }
};

exports.createProject = async (req, res, next) => {
  try {

    const checked = await valid.checkProjectInfo(req, res);
    if(!checked) return res.json(checked);

    const { title , manager , developer } = req.body;

    const validExtName = [".doc", ".docx", ".txt" , ".pdf", "xml"];
    const fileExtName = path.extname(req.file.originalname);
    if(validExtName.indexOf(fileExtName) === -1){
      return res.json({status: 'Fail', message: 'Incorrect document type'})
    } 

    const newDocUniqueName = uuidv4();
    fs.writeFileSync(`${conf.media.directory}/documents/${newDocUniqueName}${fileExtName}`, req.file.buffer);

    const project = new Project({
      title,
      document: `http://localhost:3000/${conf.media.directory}/documents/${newDocUniqueName}${fileExtName}`,
      manager,
      developer
    });

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

    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user) return res.json({message: "User is not found"});

    const id = req.params.id;
    Project.findByIdAndUpdate({_id: id},
      {
        $set: { manager: user }
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

    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user) return res.json({message: "User is not found"});

    const id = req.params.id;
    Project.findByIdAndUpdate({_id: id},
      {
        $set: { developer: user }
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