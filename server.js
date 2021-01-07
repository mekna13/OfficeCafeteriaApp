require('dotenv').config()
const express = require('express')
const app = express()

const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const path = require('path')

const mongoose = require('mongoose')
const session = require('express-session')

const flash = require('express-flash')
const MongoDbStore = require('connect-mongo')(session)

//DB Connection
const url = 'mongodb+srv://Panda:Ab541112@@cluster0.xketn.mongodb.net/cafe?retryWrites=true&w=majority'
mongoose.connect(url, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('DB Connected');
}).catch(err => {
    console.log('Connection Failed');
});



//Session

let mongoStore = new MongoDbStore({
    mongooseConnection : connection,
    collection: 'sessions'
});

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } //24 hours
}))


app.use(flash())
//Assets
app.use(express.static('public'))
app.use(express.json())

//Middleware
app.use((req, res, next) => {
    res.locals.session = req.session
    next()
})

//Template engine
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')


require('./routes/web')(app)


const PORT = process.env.PORT || 3300 
app.listen(PORT, () => {
    console.log(`Starting PORT ${PORT}`)
});