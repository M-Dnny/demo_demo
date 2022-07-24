const createError = require("http-errors");
require("dotenv").config();
const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("connect-flash");
var cors = require("cors");

var login = require("./src/routes/login");
var register = require("./src/routes/register");

const { versions } = require("process");

var app = express();

app.use(
  fileUpload({
    createParentPath: true,
  })
);

app.use(cors());

app.use(cookieParser());

app.use(session({ secret: "123", resave: false, saveUninitialized: false }));

app.use(flash());

var sessionFlash = function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
};
app.use(sessionFlash);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// login
app.use("/api/login", login);

// Register
app.use("/api/register", register);

const port = process.env.PORT || 3031;

app.listen(port, () => {
  console.log(`Server is rocking on port ${port}`);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.removeHeader("X-Powered-By");
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );

  res.locals.message = err.message;
  console.log(err.message);
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page

  res.status(err.status || 500);
  res.send({ success: false, message: "Api Not Found", data: [] });
});

module.exports = app;
