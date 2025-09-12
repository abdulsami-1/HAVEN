const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

// User schema definition
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    }
});

// Add passport-local-mongoose plugin for authentication
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);

