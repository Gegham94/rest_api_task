const express = require('express');
const router = express.Router();
const projects = require('../controllers/ProjectsController');

router.get('/', projects.getAllProjects);

router.get('/:id', projects.getProjectById);

router.post('/create', projects.createProject);

router.put('/updateManager:id', projects.updateProjectManager);

router.put('/updateDeveloper:id', projects.updateProjectDeveloper);

router.delete('/delete:id', projects.deleteProject);

module.exports = router;