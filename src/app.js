const express = require("express");
const path = require("path");

const bodyParser = require("body-parser");

const usersController = require("./controllers/userControllers");

const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 5000;
const static_path = path.join(__dirname, "../public");
const views_path = path.join(__dirname, "../templates/views");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use(express.static(static_path));

app.set("view engine", "hbs");
app.set("views", views_path);

app.get("/", (req, res) => {
  //   res.send("hello from backend");
  res.render("index");
});

app.post("/login", usersController.login);

app.get("/main", (req, res) => {
  //   res.send("hello from backend");
  res.render("main");
});

mongoose
  .connect(
    `mongodb+srv://Rinkal:rinkal1797@cluster0.2cad6.mongodb.net/speechTotext?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
  )
  .then(() => {
    console.log("Successfully connected....");
    app.listen(port, () => {
      console.log("serVer is running on port ", port);
    });
  })
  .catch((err) => {
    console.log(err);
  });
