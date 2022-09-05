const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');

router.post('/user', (req, res, next)=>{
    console.log('authenticating...');
    passport.authenticate('user_auth', {session: false}, (err, apikey, info)=>{
        // console.log('INFO', info);
        if(err || !apikey){
            return res.status(400).json({
                message: 'Something is not right',
                apikey: apikey,
                info: info,
            });
        }
        req.login(apikey, {session: false}, (err)=>{
            if(err){
                res.send(err);
            }
            const token = jwt.sign(apikey._id.toJSON(), process.env.ACCESS_SECRET);
            // return res.json({apikey, token});
            return res.json({ token});
        });
    })(req, res);
});

router.post('/admin', (req, res, next)=>{
    console.log('authenticating...');
    passport.authenticate('admin_auth', {session: false}, (err, user, info)=>{
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
            return res.json({id: user._id, token});
        });
    })(req, res);
});

module.exports = router;