require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');

// Requiring Routes
const postRouter = require('./routes/posts');
const adminRouter = require('./routes/admin');
const commentRouter = require('./routes/comment');
const auth = require('./routes/auth');

// Requiring Passport Functions
const localPassport = require('./passport/local');
const jwtPassport = require('./passport/jwt');

//MongoDB Connection
const mongoDb = process.env.DATABASE_URL;
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true, dbName: 'main' });
const db = mongoose.connection;

db.on("error", console.error.bind(console, "mongo connection error"));

const app = express();

// Necessary Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

localPassport.Setup();
jwtPassport.Setup();

// Middleware Logger
app.use((req, res, next)=>{
    console.log(req.path, req.method);
    next();
});

// Test server, no token
app.get('/', (req, res)=>{
    res.json({mssg: 'test one two three'});
});

// Login and get token
app.use('/api/login', auth);

// Test token access
app.get('/test', passport.authenticate('jwt', {session: false}) ,(req, res)=>{
    res.json({mssg: 'test one two three'});
});

// All routes
app.use('/api/posts', passport.authenticate('jwt', {session: false}), postRouter);
app.use('/api/admin', passport.authenticate('jwt', {session: false}), adminRouter);
app.use('/api/comment', passport.authenticate('jwt', {session: false}), commentRouter);

const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`listening at port ${port}`);
})