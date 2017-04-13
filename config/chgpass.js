const crypto     = require('crypto')
const rand       = require('csprng')
const mongoose   = require('mongoose')
const nodemailer = require('nodemailer')
const user       = require('./models')

const smtpTransport = nodemailer.createTransport("SMTP", {
    auth: {
        user: "user@gmail.com",
        pass: "********"
    }
});

exports.cpass = (id, opass, npass, callback) => {

    const temp1 = rand (160, 36);
    const newpass1 = temp1 + npass;
    const hashed_passwordn = crypto.createHash('sha512').update(newpass1).digest("hex");

    user.find({token: id}, (err,users) => {

        if (users.length != 0){
                        
            const temp = users[0].salt;
            const hash_db = users[0].hashed_password;
            const newpass = temp + opass;
            const hashed_password = crypto.createHash('sha512').update(newpass).digest("hex");

            if (hash_db == hashed_password) {

                if (npass.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/) && npass.length > 4 && npass.match(/[0-9]/) && npass.match(/.[!,@,#,$,%,^,&,*,?,_,~]/)) {

                    user.findOne({ token:id }, (err, doc) => {

                        doc.hashed_password = hashed_passwordn
                        doc.salt = temp1
                        doc.save()

                        callback({'response':"Password SuccessFully Changed", 'res': true})

                    })
                } else {
                    callback({'response':"New Password id Weak. Try a Strong password !", 'res': false})
                }
            } else {
                callback({'response':"Passwords do not match. Try Again !", 'res': false})
            }

        } else {
            callback({'response':"Error while changing password", 'res': false})
        }
    })

}

exports.respass_init = (email, callback) => {
    
    let temp = rand(24,24);
    user.find({email: email }, (err, users) => {

        if(users.length){
            
            user.findOne({ email: email }, (err, doc) => {

                doc.temp_str = temp
                doc.save()

                let mailOptions = {
                    from: "Degrecci <hdegrecci@gmail.com>",
                    to: email,
                    subject: "Reset Password",
                    text: `Hello ${email}. Code to reset yout Password ir ${temp}.nnRegards, nDegrecci`,

                }

                smtpTransport.sendMail(mailOptions, (error, response) => {

                    if (error) {
                        callback({'response':"Error While Resetting password. Try Again !", 'res': false})
                    } else {
                        callback({'response':"Check Yout Email and enter the verification code to resetyour password.", 'res': true})
                    }
                })
            })
        } else {
            callback({'response':"Email does not exists.",'res': false})
        }
    })
}

exports.respass_chg = (email, code, npass, callback) => {

    user.find({email: email }, (err, users) => {

        if (users.length != 0){

            const temp              = users[0].temp_str;
            const temp1             = rand(160, 36);
            const newpass1          = temp1 + npass;
            const hashed_password   = crypto.createHash('sha512').update(newpass1).digest("hex");

            if(temp == code){

                if (npass.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/) && npass.length > 4 && npass.match(/[0-9]/) && npass.match(/.[!,@,#,$,%,^,&,*,?,_,~]/)) {

                    user.findOne({ email: email }, (err, doc) => {

                        doc.hashed_password= hashed_password;
                        doc.salt = temp1;
                        doc.temp_str = "";
                        doc.save();
 
                        callback({'response':"Password Sucessfully Changed",'res':true});
 
                    })
                } else {
 
                    callback({'response':"New Password is Weak. Try a Strong Password !",'res':false});
 
                }
            } else {
 
                callback({'response':"Code does not match. Try Again !",'res':false});
 
            }
        } else {
 
            callback({'response':"Error",'res':true});
 
        }
    })
}