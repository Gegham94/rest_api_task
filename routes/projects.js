const express = require('express');
const router = express.Router();
const projects = require('../controllers/ProjectsController');

router.get('/', projects.getAllProjects);

router.get('/:id', projects.getProjectById);

router.post('/create', projects.createProject);

router.put('/assign_manager/:id', projects.assignProjectManager);

router.put('/assign_developer/:id', projects.assignProjectDeveloper);

router.delete('/delete/:id', projects.deleteProject);

module.exports = router;