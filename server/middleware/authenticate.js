let {User} = require('./../models/User');

let authenticate = (req, res, next) => {
    let token = req.header('x-auth');
    User.findOneByToken(token).then((user) => {
        if(!user){
            return Promise.reject();
        }
        req.user = user;
        req.token = token;
        next();
    }).then(() => {
        if(req.method!=="DELETE") req.user.refreshToken(token).then((user)=>{});
    }).catch((e) => {
        res.status(401).send();
    });
};

module.exports = {authenticate};