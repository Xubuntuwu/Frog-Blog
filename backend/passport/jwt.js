const passport = require("passport");
const User = require('../models/user');
const APIKey = require('../models/apikey');
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

function Setup() {
    passport.use('user_rule',
    new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.ACCESS_SECRET,
    },
    async function (jwtPayload, cb){
        console.log('PAYLOAD', jwtPayload);
        return APIKey.findOne({id: jwtPayload._id}).lean().exec()
        .then(apikey => {
            console.log('success')
            return cb(null, apikey);
        })
        .catch(err => {
            console.log('ERROR',err)
            return cb(err);
        });
    }  
    ));

    passport.use('admin_rule',
    new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.ACCESS_SECRET,
    },
    async function (jwtPayload, cb){
        console.log('PAYLOAD', jwtPayload);
        return User.findOne({id: jwtPayload._id}).lean().exec()
        .then(user => {
            console.log('success')
            return cb(null, user);
        })
        .catch(err => {
            console.log('ERROR',err)
            return cb(err);
        });
    }  
    ));
}


module.exports = {Setup};