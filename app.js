const createError = require("http-errors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const admin = require("firebase-admin");

const cors = require("cors");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = express();

app.use(cors());

// view engine setup
app.engine(
  "hbs",
  exphbs.engine({
    extname: "hbs",
    defaultLayout: "index",
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// Fetch the service account key JSON file contents
const serviceAccount = require("./express-mdn-firebase-adminsdk-key.json");

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

mongoose.set("strictQuery", false);
const dev_db_url = `mongodb+srv://admin:${process.env.MONGO_PASSWORD}@cluster0.jnybsd5.mongodb.net/firebase-auth?retryWrites=true&w=majority`;
const mongoDB = process.env.MONGODB_URI || dev_db_url;

mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Error handling should come last. Here catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  //send error message to the front end to display
  console.log(err.status, err.message);
  res.status(err.status || 500).send({ error: err.message });
});

module.exports = app;
