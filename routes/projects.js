const express = require('express');
const router = express.Router();
const projects = require('../controllers/ProjectsController');
const authUser = require('../middlewares/authUser');

const multer = require('multer');
const upload = multer({storage : multer.memoryStorage()});

router.get('/', authUser, projects.getAllProjects);
router.get('/:id', authUser, projects.getProjectById);
router.post('/create', authUser, upload.single("document"), projects.createProject);
router.put('/assign_manager/:id', authUser, projects.assignProjectManager);
router.put('/assign_developer/:id', authUser, projects.assignProjectDeveloper);
router.delete('/delete/:id', authUser, projects.deleteProject);

module.exports = router;