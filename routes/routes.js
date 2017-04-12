const chgpass   = require('./config/chgpass')
const register  = require('./config/register')
const login     = require('./config/login')

module.exports = (app) => {

    app.get('/', (req, res) => {
        res.end("node-android")
    });


    app.post('/login', (req, res) => {
        let email       = req.body.email
        let password    = req.body.password

        login.login(email, password, (found) => {
            console.log(found)
            res.json(found)
        }) 
    });

    app.post('/register', (req, res) => {
        let email       = req.body.email
        let password    = req.body.password

        register.useremail(email, password, (found) => {
            console.log(found)
            res.json(found) // Return result in JSON
        })
    });

    app.post('/api/chgpass', (req, res) => {
        let id = req.body.id
        let opass = req.body.oldpass
        let npass = req.body.newpass

        chgpass.cpass(id, opass, npass, (found) => {
            console.log(found)
            res.json(found)
        })
    });

    app.post('/api/resetpass', (req, res) => {
        let email = req.body.email

        chgpass.respass_init(email, (found) => {
            console.log(found)
            res.json(found)
        })
    });
    
}