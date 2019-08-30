const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const {isEmpty, uploadDir} = require('../../helpers/upload-helper');
const fs = require('fs');
const {userAuthenticated} = require('../../helpers/authentication');


router.all('/*',userAuthenticated,(req,res,next)=>{
    req.app.locals.layout = 'admin';
    next();
});

router.get('/',(req,res)=>{
    Post.find({})
                .populate('category')
                .then(posts=>{
        res.render('admin/posts/index', {posts: posts});
    });
});

router.get('/create',(req,res)=>{
    Category.find({}).then(categories=>{
        res.render('admin/posts/create', {categories:categories});
    });
});

router.post('/create',(req,res)=>{

    let imageName = 'empty.png';
    
    if (!isEmpty(req.files)) {
        let image = req.files.image;
        imageName = Date.now()+image.name;        

        image.mv('./public/uploads/'+ imageName, err=>{
            if (err) throw err;
        });
        console.log('no empty');
        
    }else{
        console.log('empty');
        
    }

    let allowComments = true;
    if(req.body.allowComments){
        allowComments= true;
    }else{
        allowComments= false;
    }
    const newPost = new Post({
        title:req.body.title,
        status: req.body.status,
        allowComments: allowComments,
        body : req.body.body,
        image: imageName,
        category: req.body.category
    })
    newPost.save().then(savedPost=>{
        req.flash('success_message',`Post ${savedPost.title} was created successfully`); 
        res.redirect('/admin/posts');
    }).catch(err=>{
        console.log('post no saved'); 
    });
});

router.get('/edit/:id',(req, res)=>{
    Post.findOne({_id:req.params.id}).then(post=>{
        Category.find({}).then(categories=>{
            res.render('admin/posts/edit',{post: post, categories:categories});
        });
    });
});

router.put('/edit/:id',(req, res)=>{
    Post.findOne({_id: req.params.id})
    .then(post=>{
        if(req.body.allowComments){
            allowComments=true;
        }else{
            allowComments=false;
        }
        post.title = req.body.title;
        post.status = req.body.status;
        post.allowComments = allowComments;
        post.body = req.body.body;
        post.category = req.body.category;
        
        if (!isEmpty(req.files)) {
            let image = req.files.image;
            imageName = Date.now()+image.name;

            if(post.image!='empty.png'){
                fs.unlink(uploadDir+post.image,()=>{     
                });
            };
            post.image = imageName;      
    
            image.mv('./public/uploads/'+ imageName, err=>{
                if (err) throw err;
            });
        };

        post.save().then(updatedPost=>{
            res.redirect('/admin/posts');
        }).catch(err=>{
            console.log('not updated');
        });
    });
});

router.delete('/:id',(req, res)=>{
    Post.findOne({_id: req.params.id})
        .then(post=>{
            if(post.image=='empty.png'){
                post.remove();
                res.redirect('/admin/posts');
            }else{
                fs.unlink(uploadDir+post.image,()=>{
                    post.remove();
                    res.redirect('/admin/posts');
                })
            }
        })
        .catch(err => {console.log(err);
        });
});


module.exports = router;