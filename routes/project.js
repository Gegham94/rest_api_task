const express = require('express');
const router = express.Router();
const projects = require('../controllers/ProjectsController.js');

router.get('/', projects.getProjects);

router.post('/create', projects.createProject);

router.put('/update', projects.updateProject);

router.delete('/delete', projects.deleteProject);

module.exports = router;