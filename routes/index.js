const express = require("express");
const router = express.Router();
const Message = require("../models/message");

router.get("/", async (req, res, next) => {
  res.render("main");
});

/* Get all messages. */
router.get("/messages", async (req, res, next) => {
  //excluding email and id from results
  Message.find()
    .populate("user", "-email -_id")
    .exec(function (err, results) {
      console.log(results);
      if (err) {
        return next(err);
      }

      res.status(201).send(results);
    });
});

module.exports = router;
