const express = require('express');
const router = express.Router();
const user = require('../controllers/UsersController');

const multer = require('multer');
const upload = multer({storage : multer.memoryStorage()});

router.get('/', user.getAllUsers);
router.get('/:id', user.getUserById);
router.post('/create', upload.single("image") , user.createUser);
router.put('/update/:id', user.updateUser);
router.delete('/delete/:id', user.deleteUser);

module.exports = router;