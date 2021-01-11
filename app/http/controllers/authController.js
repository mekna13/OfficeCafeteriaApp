const User = require('../../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');
const path = require('path');

function authController(){
    return{
        register(req,res){
            res.render('register');
        },
        async postRegister(req,res,next){
            const name = req.body.name
            const lastname = req.body.lastname
            const orgName = req.body.orgName
            const empId = req.body.empId
            const mobileNo = req.body.mobileNo
            const email = req.body.email
            const password = req.body.password
            const idImg = req.file.filename
            
            
            
            //Request Validation
            if(!name || !email || !password || !lastname || !orgName || !empId || !mobileNo || !idImg){

                req.flash('error','All fields are required');
                req.flash('name',name)
                req.flash('email',email)
                req.flash('orgName',orgName)
                req.flash('empId',empId)
                req.flash('mobileNo',mobileNo)

                return res.redirect('register');
            }
            
            //Checking if string entered for email is valid
            function validateEmail(email) 
            {
                var re = /\S+@\S+\.\S+/;
                return re.test(email);
            }
    
            if(validateEmail(email)===false){
                req.flash('error','Please enter valid email');
                req.flash('name',name)
                req.flash('orgName',orgName)
                req.flash('empId',empId)
                req.flash('mobileNo',mobileNo)

                return res.redirect('register');
            }

            // If account or email exists in database
            User.exists({ email: email }, (err,result) => {
                if(result){
                    req.flash('error','Email already taken');
                    req.flash('name',name)
                    req.flash('email',email)
                    req.flash('orgName',orgName)
                    req.flash('empId',empId)
                    req.flash('mobileNo',mobileNo)
                    return res.redirect('/register')
                }
            })

            

            //hash password
            const hashedPassword = await bcrypt.hash(password, 10)
            const user = new User({
                name,
                lastname,
                orgName,
                empId,
                mobileNo,
                idImg,
                email,
                password: hashedPassword
            })

            user.save().then((user) => {

                req.logIn(user, (err) => {
                    if(err){
                        req.flash('error',info.message)
                        return next(err)
                    }
                    return res.redirect('/profile');
                })
            }).catch(err => {
                req.flash('error','Try again ')
                return res.redirect('/register')
            })

         },
         profile(req,res){
            res.render('profile')
         },
        login(req,res){
            res.render('login');
        },
        postLogin(req , res , next){

            const email  = req.body.email;
            const password = req.body.password; 

            if(!email || !password) {
                req.flash('error', 'All fields are required')
                return res.redirect('/login')
            }

            passport.authenticate('local', (err, user, info) => {
                if(err){
                    req.flash('error', info.message)
                    return next(err)
                }

                if(!user){
                    req.flash('error',info.message)
                    return res.redirect('/login')
                }

                req.logIn(user, (err) => {
                    if(err){
                        req.flash('error',info.message)
                        return next(err)
                    }
                    return res.redirect('/home');
                })
            })(req, res, next)
        },
        logout(req , res ){
            req.logout()
            return res.redirect('/login')
        }
    }
}

module.exports = authController;