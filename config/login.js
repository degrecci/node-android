const crypto    = require('crypto');
const rand      = require('csprng');
const mongoose  = require('mongoose');
const gravatar  = require('gravatar');
const user      = require('./models');

exports.login = (email, password, callback) => {

    user.find({email: email}, (err, users) => {

        if (users.length != 0) {
            
            let temp = users[0].salt;
            let hash_db = users[0].hashed_password;
            let id = users[0].token;
            let newpass = temp + password;
            let hashed_password = crypto.createHash('sha512').update(newpass).digest("hex");
            let grav_url = gravatar.url(email, {s: '200', r: 'pg', d: '404'});

            if (hash_db == hashed_password) {
                
                callback({'response':"Login Success", 'res': true, 'token': id, 'grav': grav_url})
            } else {
                callback({'response': "Invalid Password", 'res': false})
            }
        } else {
            callback({'response':"User not exist", 'res': false})
        }
    })
}