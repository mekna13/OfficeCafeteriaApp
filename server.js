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
const passport = require('passport')
const Emitter = require('events')

app.use(express.static(__dirname+'/public/'))
//DB Connection
const url = 'mongodb+srv://Panda:Ab541112@@cluster0.xketn.mongodb.net/cafe?retryWrites=true&w=majority'
mongoose.connect(url, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('DB Connected');
}).catch(err => {
    console.log('Connection Failed');
});





//Session Store
let mongoStore = new MongoDbStore({
    mongooseConnection : connection,
    collection: 'sessions'
});

//Event Emitter
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)

//Session Config
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } //24 hours
}))

//Passport config
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())


app.use(flash())

//Assets
//app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//Middleware
app.use((req, res, next) => {
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})

//Template engine
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')


require('./routes/web')(app)


const PORT = process.env.PORT || 3300 
const server = app.listen(PORT, () => {
    console.log(`Starting PORT ${PORT}`)
});

//Socket
const io = require('socket.io')(server)
io.on('connection', (socket) => {
    socket.on('join', (orderId) =>{
        socket.join(orderId)
    })
})

eventEmitter.on('orderUpdated', (data) =>{
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})

eventEmitter.on('orderPlaced', (data) =>{
    io.to('adminRoom').emit('orderPlaced', data)
})