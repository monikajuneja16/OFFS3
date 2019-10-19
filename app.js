var express = require("express"),
  app = express(),
  bodyparser = require("body-parser"),
  bcrypt = require("bcrypt-nodejs"),
  session = require("express-session"),  
  sessionStore = new session.MemoryStore(),
  request = require("request"),
  methodOverride = require("method-override"),
  sql = require("mysql"),
  con = require("./models/mysql"),
  multer = require("multer"),
  routes = require("./routes/route"),
  multer= require("multer");
  ip = require("ip");
  controller = require("./models/config");
  require("dotenv").config();


app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/facultyFrontend"));

function hanu() {
  var ip = require("ip");
  console.dir(ip.address());
}

app.use(methodOverride("_method"));
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {},
    rolling: true,
    unset: "destroy"
  })
);

// This is for cross origin resource sharing
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.set("view engine", "ejs");
app.use("/", routes);

hanu();

//middleware
app.listen(process.env.port || 8080, function() {
  console.log(process.env.port);
  console.log("Listening On port " + 8080);
});

//SQL LOCK TRANSACTION , CHECK IF INTERNALLY PRESENT.
//DATA PORTAL ERRORS @ ENTERING
//TRIAL DATE 09/11
