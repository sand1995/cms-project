const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/cms', {useNewUrlParser: true}).then((db)=>{
    console.log('MongoDB Connected');
    
}).catch(err=>console.log(err));




app.use(express.static(path.join(__dirname,'public')));

app.engine('handlebars', exphbs({defaultLayout: 'home'}));
app.set('view engine', 'handlebars');

const routesHome = require('./routes/home/index');
const routesAdmin = require('./routes/admin/index');
const routesPosts = require('./routes/admin/posts');

app.use('/',routesHome);
app.use('/admin',routesAdmin);
app.use('/admin/posts',routesPosts);


app.listen(4500,()=>{
    console.log(`listening on port 4500`);
    
});