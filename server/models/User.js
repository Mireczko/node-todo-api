let mongoose = require('mongoose');
let jwt = require('jsonwebtoken');
let _ = require('lodash');

let UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 5,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    tokens: [{  
        access:{
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.toJSON = function(){
//let user = this;
    let userObject = this.toObject();
    return _.pick(userObject, ['_id', 'username']);
}

UserSchema.methods.generateAuthToken = function () {
    let user = this;
    let access = 'auth';
    let token = jwt.sign({_id: user._id.toHexString(), access}, 'secret123').toString();

    user.tokens = user.tokens.concat([{access, token}]);    //push
    return user.save().then(() => {
        return token;
    });
}

let User = mongoose.model('User', UserSchema);
  

module.exports = {
    User
};