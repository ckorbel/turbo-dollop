const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator/check");

const List = require("../../models/List");
const User = require("../../models/User");
// const Family = require("../../models/Family");

// POST api/lists
// Create a List
router.post(
  "/",
  auth,
  [
    check("title", "Title is required")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");
      // const family = await.findById(req.f)

      const newList = new List({
        title: req.body.title,
        user: user.id
      });

      const list = await newList.save();
      res.json(list);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

//GET api/lists
// Get all Lists
router.get("/", auth, async (req, res) => {
  try {
    const lists = await List.find().sort({ date: -1 });
    res.send(lists);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//GET api/list/:id
//Get specific list
router.get("/:id", auth, async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) {
      return res.status(404).json({ msg: "List not found" });
    }
    res.json(list);
  } catch (err) {}
});

//DELETE api/lists
//DELETE specific list by ID
router.delete("/:id", auth, async (req, res) => {
  try {
    const list = await List.findById(req.params.id);

    if (!list) {
      return res.status(401).json({ msg: "Post not found" });
    }

    if (list.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await list.remove();
    res.json({ msg: "List Removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectID") {
      return res.status(404).json({ msg: "List no found" });
    }
    res.status(500).send("Server error");
  }
});

//POST api/list/item/:id
//Add Item to a List
router.post(
  "/item/:id",
  auth,
  [
    check("text", "Text is required")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");
      const list = await List.findById(req.params.id);

      const newListItem = {
        text: req.body.text,
        number: req.body.number
      };

      list.groceryList.unshift(newListItem);
      list.save();
      res.json(list.groceryList);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

//PUT api/list/:list_id/grocery/:item_id
//Updates item to gorcery-list
router.put(
  "/:list_id/grocery/:item_id",
  auth,
  [
    check("text", "Text is required")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const { text, number } = req.body;
    const newItem = {
      text,
      number
    };
    try {
      const list = await List.findById(req.params.list_id);
      const updateIndex = list.groceryList
        .map(item => item.id)
        .indexOf(req.params.item_id);
      list.groceryList[updateIndex] = newItem;
      await list.save();
      res.json(list.groceryList);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

//DELETE api/list/:list_id/grocery/:item_id
//Add item to grocery-list
//Private
router.delete("/:list_id/grocery/:item_id", auth, async (req, res) => {
  try {
    const list = await List.findById(req.params.list_id);
    const removeIndex = list.groceryList
      .map(item => item.id)
      .indexOf(req.params.item_id);

    list.groceryList.splice(removeIndex, 1);
    await list.save();
    res.json(list);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
