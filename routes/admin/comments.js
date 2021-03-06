const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');
const {userAuthenticated} = require('../../helpers/authentication');


router.all('/*', userAuthenticated,(req, res, next)=>{
    req.app.locals.layout = 'admin';
    next();
});

router.get('/',(req,res)=>{
    Comment.find({}).populate('users').then(comments=>{
        console.log(comments);
        res.render('admin/comments/index',{comments: comments});
    })
    
});

router.post('/', (req, res) => {
    Post.findOne({ _id: req.body.id }).then(post => {
        const newComment = new Comment({
            user: req.body.id,
            body: req.body.body
        });
        post.comments.push(newComment);
        post.save().then(savedPost => {
            newComment.save().then(savedComment => {
                res.redirect(`/post/${post.id}`);
            });
        });
    });
});

module.exports = router;