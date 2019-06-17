const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ListSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  family: {
    type: Schema.Types.ObjectId,
    ref: "family"
  },
  title: {
    type: String,
    required: true
  },
  groceryList: [
    {
      text: String,
      number: Number
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = List = mongoose.model("list", ListSchema);
