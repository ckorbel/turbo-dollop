const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  location: {
    type: String
  },
  currentTitle: {
    type: String,
    required: true
  },
  skills: {
    type: [String],
    required: true
  },
  experience: [
    {
      title: {
        type: String,
        required: true
      },
      company: {
        type: String,
        required: true
      },
      location: {
        type: String
      },
      from: {
        type: Date,
        required: true
      },
      to: {
        type: Date,
        required: true
      },
      description: {
        type: String,
        trim: true
      }
    }
  ],
  education: [
    {
      school: {
        type: String,
        required: true
      },
      degree: {
        type: String,
        required: true
      },
      fieldofstudy: {
        type: String,
        required: true
      },
      from: {
        type: Date,
        required: true
      },
      to: {
        type: Date,
        required: true
      },
      current: {
        type: Boolean,
        default: false
      }
    }
  ],
  social: {
    linkedin: {
      type: String
    },
    github: {
      type: String
    },
    website: {
      type: String
    }
  }
});

module.exports = Profile = mongoose.model("profiles", ProfileSchema);
