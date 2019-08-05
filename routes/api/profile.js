const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator/check");
const config = require("config");

const Profile = require("../../models/Profile");
const User = require("../../models/User");

router.get("/", (req, res) => res.send("Profile test route"));

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "users",
      ["firstName", "lastName"]
    );

    if (!profile) {
      return res
        .status(400)
        .json({ msg: "There is no profile for this user " });
    }

    res.json(profile);
  } catch (err) {
    console.log.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
