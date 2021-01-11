require('dotenv').config()
const express = require('express');
const app = express();

const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const path = require('path');

const mongoose = require('mongoose');
const session = require('express-session');

const flash = require('express-flash');
const MongoDbStore = require('connect-mongo')(session)

const passport = require('passport')

app.use(express.static(__dirname+'/public/'))

mongoose.connect('mongodb+srv://Panda:Ab541112@@cluster0.xketn.mongodb.net/cafe?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  userCreateIndex: true,
});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database connected...');
}).catch(err => {
    console.log('Connection failed...')
});


//Session Store
let mongoStore = new MongoDbStore({
  mongooseConnection: connection,
  collection: 'sessions'
})

//session config
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}))


//Passport configuration
const passportSet = require('./app/config/passport')
passportSet(passport)
app.use(passport.initialize())
app.use(passport.session())


app.use(flash());

app.use(express.urlencoded({ extended: false }));
app.use(express.json()); 


//Global MiddleWare
app.use((req,res,next) =>{
  res.locals.session = req.session
  res.locals.user = req.user
  next()
})

//setting template Engine
app.set('views', path.join(__dirname,'/resources/views'))
app.set('view engine','ejs');
app.use(expressLayout)


require('./routes/web')(app)
//routes

const PORT = process.env.PORT || 3000;
app.listen(PORT,() => {
    console.log("listening on port 3000");
})