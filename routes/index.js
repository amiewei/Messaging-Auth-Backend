const express = require("express");
const router = express.Router();
const Message = require("../models/message");

router.get("/", async (req, res, next) => {
  res.render("main");
});

/* Get all messages. */
router.get("/messages", async (req, res, next) => {
  Message.find()
    .populate("user")
    .exec(function (err, results) {
      if (err) {
        return next(err);
      }

      res.status(201).send(results);
    });
});

// router.get("/*", function (req, res) {
//   console.log("catch all");

//   // const __dirname = "/Users/swei1/VscodeProj/vite-react-tailwind-v3-auth";
//   res.status(406).send();
// });

module.exports = router;
