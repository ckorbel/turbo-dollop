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

//GET ALL profiles
//NOTE: will need future query criteria
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

//GET profile by user_id
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate("user", ["firstName", "lastName"]);

    if (!profile) res.status(400).json({ msg: "Profile not found" });

    res.json(profile);
  } catch (err) {
    console.log(err);
    if (err.kind == "ObjectId") {
      res.status(400).json({ msg: "Profile not found" });
    }
    res.status(500).send("Server Error");
  }
});

//DELETE profile and user
//private
router.delete("/", auth, async (req, res) => {
  try {
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: "User account deleted" });
  } catch (err) {
    console.log(err.message);
    res.status(500);
  }
});

//Add experience to profile
//private
router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is a required field")
        .not()
        .isEmpty(),
      check("title", "Company is a required field")
        .not()
        .isEmpty(),
      check("from", "Start Date is a required field")
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
      title,
      current,
      company,
      location,
      from,
      to,
      description
    } = req.body;

    const newExp = {
      title,
      current,
      company,
      location,
      from,
      to,
      description
    };
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newExp);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//Delete experience from profile
//private
router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

//Add education to profile
//private
router.put(
  "/education",
  [
    auth,
    [
      check("school", "School is a required field")
        .not()
        .isEmpty(),
      check("degree", "Degree is a required field")
        .not()
        .isEmpty(),
      check("fieldofstudy", "Field of Study is a required field")
        .not()
        .isEmpty(),
      check("from", "Start Date is a required field")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { school, degree, fieldofstudy, from, to, current } = req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current
    };
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.education.unshift(newEdu);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//Delete education from profile
//private
router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.edu_id);

    profile.education.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
