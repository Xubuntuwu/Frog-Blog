const bcrypt = require('bcryptjs');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require('../models/user');
const APIKey = require('../models/apikey');

function Setup() {
    passport.use('user_auth',
        new LocalStrategy({ // or whatever you want to use
            usernameField: 'type',    // define the parameter in req.body that passport can use as username and password
            passwordField: 'key'
          },
          (type, key, done) => {
            APIKey.findOne({}, (err, apikey) => {
            if (err) { 
                return done(err);
            }
            console.log(apikey)
            bcrypt.compare(key, apikey.key, (err, res) => {
                if (res) {
                return done(null, apikey)
            } else {
                return done(null, false, { message: "Incorrect APIKey" })
            }
            })
            });
        })
    );

    passport.use('admin_auth',
        new LocalStrategy((username, password, done) => {
            User.findOne({ username: username }, (err, user) => {
            if (err) { 
                return done(err);
            }
            if (!user) {
                return done(null, false, { message: "Incorrect username" });
            }
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                // passwords match! log user in
                return done(null, user)
            } else {
                // passwords do not match!
                return done(null, false, { message: "Incorrect password" })
            }
            })
            });
        })
    );

    // passport.serializeUser(function(user, done) {
    //     done(null, user.id);
    // });
    
    // passport.deserializeUser(function(id, done) {
    //     User.findById(id, function(err, user) {
    //         done(err, user);
    //     });
    // });
        
}


module.exports = {Setup};