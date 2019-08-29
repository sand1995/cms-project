const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const upload = require('express-fileupload');
const session = require('express-session');
const flash = require('connect-flash');
const {mongoDBUrl} = require('./config/database'); 
const passport = require('passport');

//mongo conection
mongoose.connect(mongoDBUrl, {useNewUrlParser: true}).then((db)=>{
    console.log('MongoDB Connected');
    
}).catch(err=>console.log(err));


app.use(express.static(path.join(__dirname,'public')));

//set view engine
const {select, generateTime} = require('./helpers/handlebars-helper');
app.engine('handlebars', exphbs({defaultLayout: 'home', helpers: {select: select, generateTime: generateTime}}));
app.set('view engine', 'handlebars');

//upload middleware
app.use(upload());

//body parser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//method Override
app.use(methodOverride('_method'));

app.use(session({
    secret: 'Zant123',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());

//PASSPORT
app.use(passport.initialize());
app.use(passport.session());

//Local Variables using Middleware
app.use((req, res, next)=>{
    res.locals.user = req.user || null;
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.error = req.flash('error');
    next();
});

//load routes
const routesHome = require('./routes/home/index');
const routesAdmin = require('./routes/admin/index');
const routesPosts = require('./routes/admin/posts');
const routesCategories = require('./routes/admin/categories');
//use routes
app.use('/',routesHome);
app.use('/admin',routesAdmin);
app.use('/admin/posts',routesPosts);
app.use('/admin/categories',routesCategories);


app.listen(4500,()=>{
    console.log(`listening on port 4500`);
    
});