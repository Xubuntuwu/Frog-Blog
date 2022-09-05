// ADD API AUTHENTICATION WITH JWT INSTEAD OF ENTERING PASSWORDS EVERYWHERE
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { default: mongoose } = require('mongoose');

// Import Mongoose Models
const User = require('../models/user');
const Comment = require('../models/comment');

// See all comments of a certain post
router.get('/post/:postid', async (req, res, next)=>{
    const comments = await Comment.find({postid: req.params.postid}).lean().exec()
        .catch((err)=> next(err));
    
    res.json({comments});
});

// Create a comment on a certain post
router.post('/post/:postid', async(req, res, next)=>{
    // console.log('new comment')
    new Comment({
        content: req.body.content,
        postid: mongoose.Types.ObjectId(req.params.postid),
        ownername: req.body.ownername,
        // ownerid: req.body.ownerid,
        location: req.headers['x-forwarded-for'] || req.socket.remoteAddress ,
    }).save((err, result)=>{
        if(err){
            return res.json({error: err});
        }
        return res.json({comment: result, mssg: 'post success'});
    })
});

// Get specific comment
router.get('/:commentid', async (req, res, next)=>{
    const comment = await Comment.find({_id: req.params.commentid}).lean().exec()
    .catch((err)=> next(err));

    res.json({comment});
});

// Update specific comment that belongs to an admin user
router.patch('/:commentid', async(req, res, next)=>{
    const comment = await Comment.findOne({_id: req.params.commentid}).lean().exec()
    .catch((err)=> next(err));

    if(!comment.ownerid){
        return res.json({error: 'comment can not be edited if it doesn\'t belogn to an admin'})
    }
    const user = await User.findOne({_id: comment.ownerid}).lean().exec()
    .catch((err)=> next(err));
    bcrypt.compare(req.body.password, user.password, async (err, result) => {
        if (result) {
            const content = req.body.content || comment.content;

            const update = await Comment.findByIdAndUpdate(req.params.commentid, {content}, {new: true}).lean().exec()
                .catch(err=> next(err));
            return res.json({comment: update, mssg: 'update success'});
        }
        else if(err){
            return res.json({error: 'wrong password'});
        }
    });
});


// Delete specific comment
// can only be done by admin
router.delete('/:commentid', async(req, res, next)=>{
    const admin = await User.findOne({username: req.body.username}).lean().exec()
    .catch(err=> next(err));

    bcrypt.compare(req.body.password, admin.password, async (err, result) => {
        if (result) {
            const deleted = await Comment.findByIdAndDelete(req.params.commentid).lean().exec()
            .catch(err=> next(err));

            res.json({comment: deleted, mssg: 'delete success'});
        }
        else if(err){
            res.json({error: 'wrong password'})
        }
    });

});

module.exports = router;