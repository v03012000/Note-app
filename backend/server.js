var express=require('express');
const passport = require('passport');
const session = require("express-session");
let cors = require('cors'),
   bodyParser = require('body-parser'),
   cookieParser = require('cookie-parser');
require('./api/models/db');
require('./api/config/passport');

var app=express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({secret: "secret"}));
app.use(passport.initialize());
app.use(passport.session());

var routesApi = require('./api/routes/index');
app.use('/api', routesApi);

app.get('/',function(req,res)
{
res.send("Hello World!");
});


const port = 4000;



app.listen(port,function() {console.log("server started ")});
