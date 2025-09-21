const express = require('express');
const authmiddleware = require('../middleware/auth-middleware')
const adminMiddleware = require('../middleware/admin-middleware')

const router = express.Router();

router.get('/welcome', authmiddleware, adminMiddleware, (req,res)=>{
    res.json({
        message: 'Welcome to the admine page'
    })
})

module.exports = router;