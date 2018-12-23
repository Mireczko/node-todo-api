const {SHA256} = require('crypto-js');

let message = "raz dwa trzy";
let hash = SHA256(message).toString();
console.log(hash);
