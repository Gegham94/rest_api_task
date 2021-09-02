const express = require('express');
const router = express.Router();
const projects = require('../controllers/ProjectsController');

const multer = require('multer');
const upload = multer({storage : multer.memoryStorage()});

router.get('/', projects.getAllProjects);
router.get('/:id', projects.getProjectById);
router.post('/create', upload.single("document"), projects.createProject);
router.put('/assign_manager/:id', projects.assignProjectManager);
router.put('/assign_developer/:id', projects.assignProjectDeveloper);
router.delete('/delete/:id', projects.deleteProject);

module.exports = router;