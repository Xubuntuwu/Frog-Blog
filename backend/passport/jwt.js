const passport = require("passport");
const User = require('../models/user');
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

function Setup() {
    passport.use(
    new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.ACCESS_SECRET,
    },
    async function (jwtPayload, cb){
        console.log('PAYLOAD', jwtPayload);
        return User.findOne({id: jwtPayload._id}).lean().exec()
        .then(user => {
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