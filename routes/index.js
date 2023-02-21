const express = require("express");
const router = express.Router();
const Message = require("../models/message");

/* GET home page. */

router.get("/api/messages", async (req, res, next) => {
  console.log("messages: ");
  Message.find()
    .populate("user")
    .exec(function (err, results) {
      if (err) {
        console.log("error found");
        return next(err);
      }

      // console.log(results)
      res.status(201).send(results);
    });
});

module.exports = router;
