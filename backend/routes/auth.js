const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');

router.post('/', (req, res, next)=>{
    console.log('authenticating...');
    passport.authenticate('local', {session: false}, (err, user, info)=>{
        // console.log('INFO', info);
        if(err || !user){
            return res.status(400).json({
                message: 'Something is not right',
                user: user,
                info: info,
            });
        }
        req.login(user, {session: false}, (err)=>{
            if(err){
                res.send(err);
            }

            const token = jwt.sign(user._id.toJSON(), process.env.ACCESS_SECRET);
            return res.json({user, token});
        });
    })(req, res);
});

module.exports = router;