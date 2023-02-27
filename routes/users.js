const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Message = require("../models/message");
const createError = require("http-errors");
const { getAuth } = require("firebase-admin/auth");
const { verifyUserIdToken, verifyIsAdmin } = require("../middleware/auth");

//middleware to verify user idtoken and check if isAdmin is passed
router.use(verifyUserIdToken, verifyIsAdmin);

// Update user's display name or create an entry for the user if not in db
router.patch("/:uid", async (req, res, next) => {
  const uid = req.firebaseuid;
  const { displayName, email } = req.body;
  const isAdmin = req.firebaseIsAdmin;

  if (!displayName) {
    return next(createError(400, "Display Name Cannot Be Empty"));
  }

  if (isAdmin === undefined) {
    isAdmin = false;
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { uid },
      { displayName, email, isAdmin },
      { new: true, upsert: true }
    );

    res.status(201).send(); //this just sends status code of 201 to acknowledge success but no data
  } catch (error) {
    return next(createError(500, "Internal server error"));
  }
});

router.post("/message/add", (req, res, next) => {
  const { uid, message, image } = req.body;
  const timestamp = new Date();

  if (req.firebaseuid === uid) {
    User.findOne({ uid }).exec(function (err, result) {
      if (err) {
        return next(err);
      }

      const newMsg = new Message({
        uid,
        body: message,
        user: result._id,
        image,
        timestamp,
      });

      newMsg.save((err) => {
        if (err) {
          return next(err);
        }
      });

      res.status(201).send();
    });
  } else {
    return next(createError(403, "Access Forbidden - User Not Matched"));
  }
});

router.delete("/message/delete", (req, res, next) => {
  console.log("/message/delete");
  const { messageid, uid, deletiontype } = req.body || {};

  if (req.firebaseuid === uid) {
    if (deletiontype === "all") {
      if (req.firebaseIsAdmin) {
        Message.deleteMany({ uid }).exec(function (err, result) {
          if (err) {
            return next(err);
          }
        });
      } else {
        return next(createError(403, "Access Forbidden - Admin Only"));
      }
    } else if (messageid) {
      Message.deleteOne({ _id: messageid }).exec(function (err, result) {
        if (err) {
          return next(err);
        }
      });
    }
  } else {
    return next(createError(403, "Access Forbidden - User Not Matched"));
  }

  res.status(201).send();
});

module.exports = router;
