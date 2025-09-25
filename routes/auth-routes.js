const express = require("express");
const {registerUser, loginUser, changePassword} = require('../controllers/auth-controller')
const router = express.Router();
const authmiddleware = require('../middleware/auth-middleware')

// all routes are related to authentication or authorization
router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/change-password', authmiddleware, changePassword)


module.exports = router