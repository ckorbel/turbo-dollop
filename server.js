const express = require("express");
const app = express();
const connectDB = require("./db/mongoose");
const redis = require("redis");

connectDB();

// let client = redis.createClient();
// client.on("connect", () => {
//   console.log("Redis connected");
// });

// client.on("error", err => {
//   console.log(`Something went wrong ${err}`);
// });

app.use(express.json({ extended: false }));

app.use("/api/users", require("./routes/api/users"));
app.use("/api/profiles", require("./routes/api/profile"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/lists", require("./routes/api/lists"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
