const express = require("express");
const router = express.Router();
const User = require("../models/user");
const createError = require("http-errors");
const { getAuth } = require("firebase-admin/auth");

const verifyUserIdToken = (req, res, next) => {
  console.log("verify user id token");
  const userIdToken = req.headers.authorization;
  const isAdmin = req.body.isAdmin;

  try {
    getAuth()
      .verifyIdToken(userIdToken)
      .then((decodedToken) => {
        const uid = decodedToken.uid;

        //attach the uid from firebase admin sdk to the req
        req.firebaseuid = uid;
        req.firebaseIsAdmin = isAdmin;
        next();
      });
  } catch (error) {
    next(createError(403, error));
  }
};

const verifyIsAdmin = (req, res, next) => {
  const uid = req.firebaseuid;
  const isAdmin = req.firebaseIsAdmin;

  User.findOne({ uid }).exec(function (err, result) {
    if (err) {
      return next(err);
    }
    //check if isAdmin is passed through client or user is already admin in db then attach admin value to request
    if ((result && result.isAdmin) || isAdmin) {
      req.firebaseIsAdmin = true;
    } else {
      req.firebaseIsAdmin = false;
    }

    next();
  });
};

module.exports = { verifyUserIdToken, verifyIsAdmin };
