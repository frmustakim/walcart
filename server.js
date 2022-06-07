const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const config = require("config");

const app = express();

app.use(cors());

//Body-parser middleware
app.use(express.json());


//DB config
const db = config.get("mongoURI");
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

//Connect to mongo
mongoose
  .connect(db, options)
  .then(() => console.log(`MongoDB Connected!`))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//Use routes
app.use("/api/category", require("./routes/api/categoryRoute"));

const port = process.env.PORT || 5000;

app.listen(port, console.log(`Server running on port ${port}`));