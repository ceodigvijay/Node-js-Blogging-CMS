var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  methodOverride = require("method-override"),
  indexRoute = require("./routes/index"),
  postRoute = require("./routes/blog"),
  commentRoute = require("./routes/comment"),
  authRoute = require("./routes/auth"),
  passport = require("passport"),
  localStrategy = require("passport-local"),
  passportLocalMongoose = require("passport-local-mongoose"),
  User = require("./models/user"),
  flash = require('connect-flash');

app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(flash())

app.use(
  require("express-session")({
    secret: "I am king of my thoughts 43223",
    resave: false,
    saveUninitialized: false
  })
);

passport.use(new localStrategy(User.authenticate()));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.error = req.flash('error')
  res.locals.success = req.flash('success')
  res.locals.currentUser = req.user;
  next();
});
// Auth Part

app.use(indexRoute);
app.use(postRoute);
app.use(commentRoute);
app.use(authRoute);

mongoose.connect("mongodb://localhost/croud_head", { useNewUrlParser: true });

/* TODO : 
            (Optional) Add mailchimpu
*/

app.set("view engine", "ejs");

app.listen(3000, function() {
  console.log("Server Started at Port 3000");
});
