const express = require('express');
const router = express.Router();
const Category = require('../../models/Category');

router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req, res)=>{
    Category.find({}).then(categories =>{
        res.render('admin/categories/index', {categories:categories});
    })
    
});

router.post('/create',(req, res)=>{
    const newCategory = new Category({
        category:req.body.category,
    });
    
    newCategory.save().then(savedCategory=>{
        res.redirect('/admin/categories');
    })
})

router.get('/edit/:id', (req, res)=>{
    Category.findOne({_id:req.params.id}).then(category =>{
        res.render('admin/categories/edit', {category:category});
    })
});

router.put('/edit/:id', (req, res)=>{
    Category.findOne({_id:req.params.id}).then(category =>{
        category.category=req.body.category;
        category.save().then(categorySaved=>{
            res.redirect('/admin/categories');
        });
        
    })
});

router.delete('/:id',(req, res)=>{
    Category.deleteOne({_id:req.params.id}).then(result=>{
        res.redirect('/admin/categories');
    })
})

module.exports = router;