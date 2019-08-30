const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    category:{
        type: Schema.Types.ObjectId,
        ref: 'categories'
    },
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
    },
    //relation array id´s comments
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'comments'
    }]
}, {usePushEach:true});

module.exports=mongoose.model('posts', PostSchema);