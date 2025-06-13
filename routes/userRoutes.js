const express = require('express');
const { createUser, getAllUsers } = require('../controllers/userController'); // <--- IMPORT getAllUsers

const router = express.Router();

router.post('/', createUser); // POST /api/users (Create User)
router.get('/', getAllUsers);   // <--- ADD THIS LINE: GET /api/users (Get All Users)

module.exports = router;