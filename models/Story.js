const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
    title : {
        type : String,
        required : false,
        trim : true
    },
    body : {
        type : String,
        required : false
    },
    status : {
        type : String,
        default : 'public',
        enum: ['public', 'private']
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    createAt : {
        type : Date,
        default : Date.now
    }
});

module.exports = mongoose.model('Story', StorySchema);