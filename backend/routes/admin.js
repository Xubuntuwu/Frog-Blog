const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// Import Mongoose Models
const User = require('../models/user');
const Post = require('../models/post');
// const Comment = require('../models/comment');

// See all admin users
router.get('/', async (req, res, next)=>{
    const users = await User.find().lean().exec()
        .catch((err)=> next(err));
    
    res.json({users: users});
});

// Create an admin user
router.post('/', async(req, res, next)=>{

    const sameuser = await User.find({username: req.body.username}).lean().exec();
    if(sameuser.length>=1){
        return res.statusCode(403).json({error: 'Username already exists'});
    }
    else{
        bcrypt.hash(req.body.password, 10, async(err, hashedPassword) => {
            if (err) { 
                return next(err);
            } 
        new User({
            username: req.body.username,
            password: hashedPassword,
            admin: true,

        }).save((err, user)=>{
            if(err){
                return next(err);
            }
            res.json({user: user, mssg: 'user success'});
        })
        })
    }
});

// Get specific admin user
router.get('/:id', async (req, res, next)=>{
    const user = await User.find({_id: req.params.id}).lean().exec()
    .catch((err)=> next(err));

    res.json({user: user});
});

// Update specific admin user
// this requires a password to be sent in in the body?
router.patch('/:id', async(req, res, next)=>{
    const user = await User.findOne({_id: req.params.id}).lean().exec()
    .catch((err)=> next(err));

    bcrypt.compare(req.body.password, user.password, async (err, result) => {
        if (result) {

            const hashedPassword = await new Promise((resolve, reject) => {
                if (!req.body.newpassword){
                    resolve(null);
                }
                bcrypt.hash(req.body.newpassword, 10, function(err, hash) {
                  if (err) {
                    return reject(err)
                  }
                  return resolve(hash)
                });
              });
            const username = req.body.username || user.username;
            const password = req.body.newpassword ? hashedPassword : user.password;
            
            const update = await User.findByIdAndUpdate(req.params.id, {username, password}, {new: true}).lean().exec()
                .catch(err=> next(err));
            return res.json({user: update, mssg: 'update success'});
        }
        else if(err){
            return res.json({error: 'wrong password'});
        }
    });
});


// Delete specific admin user
// this requires a password to be sent in in the body?
// This deletes their posts too!
router.delete('/:id', async(req, res, next)=>{
    const deleted = await User.findById(req.params.id).lean().exec()
    .catch(err=> next(err));

    bcrypt.compare(req.body.password, deleted.password, async (err, result) => {
        if (result) {
            await Post.deleteMany({ownerid: deleted._id})
                .catch(err=> next(err));
            const deleted = await User.findByIdAndDelete(req.params.id).lean().exec()
                .catch(err=> next(err));

            res.json({post: deleted, mssg: 'delete success'});
        }
        else if(err){
            res.json({error: 'wrong password'})
        }
    });

});

module.exports = router;