const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FamilySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  admins: [
    {
      type: Schema.Types.ObjectId,
      ref: "users"
    }
  ],
  members: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      },
      name: {
        type: String
      }
    }
  ]
});

module.exports = Family = mongoose.model("family", FamilySchema);
