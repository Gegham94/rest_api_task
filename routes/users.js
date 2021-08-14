const express = require('express');
const router = express.Router();
const user = require('../controllers/UsersController');

router.get('/', user.getAllUsers);

router.get('/:id', user.getUserById);

router.post('/create', user.createUser);

router.put('/update/:id', user.updateUser);

router.delete('/delete/:id', user.deleteUser);

module.exports = router;