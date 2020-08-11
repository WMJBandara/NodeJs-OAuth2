const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    Id : {
        type : String,
        required : false
    },
    displayName : {
        type : String,
        required : false
    },
    firstName : {
        type : String,
        required : false
    },
    lastName : {
        type : String,
        required : false
    },
    image : {
        type : String,
        required : false
    },
    createAt : {
        type : Date,
        default : Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);