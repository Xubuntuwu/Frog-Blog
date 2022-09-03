const express = require('express');
const router = express.Router();

// Import Mongoose Models
const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');
const { default: mongoose } = require('mongoose');

router.get('/', async (req, res, next)=>{
    const posts = await Post.find().populate('owner').lean().exec()
        .catch((err)=> next(err));
    
    res.json({posts: posts});
    // res.json({mssg: 'Get all posts'});
});

router.post('/', (req, res, next)=>{
    new Post({
        title: req.body.title,
        content: req.body.content,
        public: req.body.public || false,
        owner: mongoose.Types.ObjectId('6311d20f91590be401b53062'),

    }).save((err, post)=>{
        if(err){
            return next(err);
        }
        res.json({post: post, mssg: 'post success'});
    })
    // res.json({mssg: 'Create specific post'});
});

router.get('/:id', async (req, res, next)=>{
    const post = await Post.find({_id: req.params.id}).populate('owner').lean().exec()
    .catch((err)=> next(err));
    res.json({post: post});
    // res.json({mssg: 'Get specific post: '+ req.params.id});
});

router.patch('/:id', async(req, res, next)=>{
    const oldPost = await Post.find({_id: req.params.id}).lean().exec()
    
    const title = req.body.title || oldPost.title;
    const content = req.body.content || oldPost.content;
    const public = req.body.public || oldPost.public;

    const update = await Post.findByIdAndUpdate(req.params.id, {title: title, content: content, public: public}, {new: true}).lean().exec()
        .catch(err=> next(err));
    res.json({post: update, mssg: 'update success'});
    // res.json({mssg: `update specific post: ${req.params.id}`});
});

router.delete('/:id', async(req, res, next)=>{
    const deleted = await Post.findByIdAndDelete(req.params.id).lean().exec()
        .catch(err=> next(err));
    res.json({post: deleted, mssg: 'delete success'});
    // res.json({mssg: `update specific post: ${req.params.id}`});
});

module.exports = router;