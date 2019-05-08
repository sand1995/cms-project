const express = require('express');
const router = express.Router();
const Post = require('../../models/Post')
const {isEmpty, uploadDir} = require('../../helpers/upload-helper');
const fs = require('fs');

router.all('/*',(req,res,next)=>{
    req.app.locals.layout = 'admin';
    next();
});


router.get('/',(req,res)=>{
    Post.find({}).then(posts=>{
        res.render('admin/posts/index', {posts: posts});
    })
    

});

router.get('/create',(req,res)=>{
    res.render('admin/posts/create');
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
    })
    newPost.save().then(savedPost=>{
        req.flash('success_message',`Post ${savedPost.title} was created succesfully`);
        console.log(savedPost);
        
        res.redirect('/admin/posts');
    }).catch(err=>{
        console.log('post no saved'); 
    });
});

router.get('/edit/:id',(req, res)=>{
    Post.findOne({_id:req.params.id}).then(post=>{
        res.render('admin/posts/edit',{post: post});
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