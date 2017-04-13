const express   = require('express')
const connect   = require('connect')
const app       = express();
const port      = process.env.PORT || 8080;


// === Configurations ===
app.use(express.static(__dirname + '/public'))
app.use(connect.logger('dev'));
app.use(connect.json());
app.use(connect.urlencoded());

// === Routes ===
require('./routes/routes.js')(app)

console.log(`App is running on ${port}`)