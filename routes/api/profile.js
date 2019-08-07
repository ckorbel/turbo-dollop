const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator/check");
const config = require("config");

const Profile = require("../../models/Profile");
const User = require("../../models/User");

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

// POST api/profiles
// Create/Update user profile
router.post(
  "/",
  [
    auth,
    [
      check("currentTitle", "Current title is required")
        .not()
        .isEmpty(),
      check("skills", "skills is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      location,
      bio,
      currentTitle,
      skills,
      linkedin,
      github,
      website
    } = req.body;

    const profileFields = {};
    profileFields.user = req.user.id;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (currentTitle) profileFields.currentTitle = currentTitle;
    if (skills) profileFields.skills = skills;

    if (skills) {
      profileFields.skills = skills.split(",").map(skill => skill.trim());
    }

    profileFields.social = {};
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (github) profileFields.social.github = github;
    if (website) profileFields.social.website = website;
    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }

      //Create if no existing profile
      profile = new Profile(profileFields);
      await profile.save();
      return res.json(profile);
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", [
      "firstName",
      "lastName"
    ]);
    res.json(profiles);
  } catch (err) {
    console.log(err.message);
    res.status(500);
  }
});

module.exports = router;
