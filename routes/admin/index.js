const express = require('express');
const router = express.Router();
const faker = require('faker');
const Post = require('../../models/Post');

router.all('/*',(req,res,next)=>{
    req.app.locals.layout = 'admin';
    next();
});

router.get('/',(req,res)=>{
    res.render('admin/index');
});

router.post('/generate-fake-posts',(req,res)=>{
    let statusOptions = ['public', 'private', 'draft'];
    let imageName= 'empty.png';
    for (let i = 0; i < req.body.amount; i++) {
        let post = new Post();
        post.title = faker.random.word();
        post.status = statusOptions[Math.floor(Math.random()*statusOptions.length)];
        post. allowComments=faker.random.boolean();
        post.body = faker.lorem.sentence();
        post.image = imageName;
        
        post.save().then(savedPost=>{ });
        
    }
    res.redirect('/admin/posts');
});


module.exports = router;