const authController = require('../app/http/controllers/authController')
const guest = require('../app/http/middleware/guest')
const upload = require('../app/http/middleware/upload')
const express = require('express')

function initRoutes(app){
    

    app.get('/home',(req , res ) => {
        res.render('home');
    })

    app.get('/register',guest,authController().register);
    app.post('/register',upload,authController().postRegister);
    app.get('/profile',authController().profile);
    app.get('/login',guest,authController().login);
    app.post('/login',authController().postLogin)
    app.post('/logout',authController().logout)
    
}

module.exports = initRoutes;