//CRUD

const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "organization-app";

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (err, client) => {
  if (err) {
    return console.log(`Something went wrong ${err}`);
  }
  console.log("Connected to MongoDB");

  const db = client.db(databaseName);
});
