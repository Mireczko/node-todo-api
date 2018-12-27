let mongoose = require('mongoose');
let jwt = require('jsonwebtoken');
let _ = require('lodash');
const bcrypt = require('bcryptjs');

ChildTokenSchema = new mongoose.Schema({
    access: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {type:Number,default:Date.now},
    lastUsedAt:{
        type: Number,
        default: Date.now
    }
});

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
    tokens: [ChildTokenSchema]
});

UserSchema.methods.removeOldToken = function(token){
    setTimeout(()=> {
        this.removeToken(token, 600000).then((user) => {
            console.log(user);
        }).catch((e) => {
            console.log(e);
        });
    },600000)
};

UserSchema.methods.toJSON = function(){
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
};

UserSchema.statics.findOneByToken = function (token) {
    let User = this;
    let decoded;

    try{
        decoded = jwt.verify(token, 'secret123');
    } catch(e) {
        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

UserSchema.methods.removeToken = function(token, maxAge){
    let user = this;
    return user.updateOne(
        {$pull: {
            tokens: {
                token: token,
                lastUsedAt: {$lt: maxAge ? Date.now() - maxAge : Date.now()}
            },
        }
    });
};

UserSchema.methods.refreshToken = function(token){
    let user = this;
    let tokenObject;
    for(let i=0; i<user.tokens.length; i++){
        tokenObject = user.tokens[i];
        if(tokenObject.token===token){
            break;
        }
    }
    tokenObject.lastUsedAt = Date.now();
    return user.updateOne(
        {
        $set: {'tokens': tokenObject}
    });
}

UserSchema.statics.removeTrashTokens = function(maxAge){
    let User = this;
    return User.updateMany({
        $pull:{
            tokens:{
                lastUsedAt: {$lt: maxAge ? Date.now() - maxAge : Date.now()}
            }
        }
    });
};


UserSchema.statics.findByCredentials = function(username, password){
    let User = this;
    return User.findOne({username}).then((user) => {
        if(!user){
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) =>{
                if(res){
                    resolve(user);
                } else {
                    reject();
                }
            });
        });
    });
};

UserSchema.pre('save', function(next) {
    let user = this;

    if(user.isModified('password')){
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next(); 
            });
        });
    } else {
        next();
    }
});

let User = mongoose.model('User', UserSchema);
  

module.exports = {
    User
};