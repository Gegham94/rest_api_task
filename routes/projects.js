const express = require('express');
const router = express.Router();
const projects = require('../controllers/ProjectsController');

router.get('/', projects.getAllProjects);

router.get('/:id', projects.getProjectById);

router.post('/create', projects.createProject);

router.put('/update', projects.updateProject);

router.delete('/delete', projects.deleteProject);

module.exports = router;