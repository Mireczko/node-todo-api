const bcrypt = require('bcryptjs');

let pass = "123abc";
bcrypt.genSalt(1024, (err, salt) => {
    bcrypt.hash(pass, salt, (err, hash) => {
        console.log(hash);
    })
})