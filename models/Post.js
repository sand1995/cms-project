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
    },
    date:{
        type: Date,
        default: Date.now()
    }
});

module.exports=mongoose.model('posts', PostSchema);