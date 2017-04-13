const crypto    = require('crypto')
const rand      = require('csprng')
const mongoose  = require('mongoose')
const user      = require('./models')

exports.register = (email, password,callback) => {
    let x = email

    if (!(x.indexOf("@")=x.length)){
        if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/) && password.length > 4 && password.match(/[0-9]/) && password.match(/.[!,@,#,$,%,^,&,*,?,_,~]/)) {

            let temp = rand(160, 36)
            let newpass = temp + password
            let token = crypto.createHash('sha512').update(email + rand).digest("hex");
            let hashed_password = crypto.createHach('sha512').update(newpass).digest("hex")

            let newuser = new user({
                token: token,
                email: email,
                hashed_password: hashed_password,
                salt: temp });
            
            user.find({email: email}, (err, users) => {

                if (users.length == 0 ){
                    newuser.save( (err) => {

                        callback({'response':"Sucessfully Registered"})
                    })
                } else {
                    callback({'response':"Email already Registered"})
                }
            })
        } else {
            callback({'response':"Password Weak"})
        }
    } else {
        callback({'response':"Email Not Valid"})
    }
}