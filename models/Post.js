const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title:{
        type: String,
        require: true
    },
    status:{
        type: String,
        default: 'public'
    },
    allowComments:{
        type: Boolean,
        require: true
    },
    body:{
        type:String,
        require: true
    },
    image:{
        type: String
    }
});

module.exports=mongoose.model('posts', PostSchema);