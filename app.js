// Importing Libraries
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const hbs = require("hbs")

dotenv.config({ path: "./.env" });

const app = express();


//setting up file directories
const publicDirectory = path.join(__dirname, "./public");
app.use(express.static(publicDirectory));

const imageDirectory = path.join(__dirname, "./images");
app.use("/images", express.static(imageDirectory));

const partialsPath = path.join(__dirname,"./views/partials")
hbs.registerPartials(partialsPath)

//Parses data through forms
app.use(express.urlencoded({ extended: true })); //changed to true
//Parsed bodies come in as Json ( format )
app.use(express.json());


app.set("view engine", "hbs");
app.use(cookieParser());


// Routes
app.use("/", require("./routes/pages"));
app.use("/auth", require("./routes/auth"));

app.listen(process.env.PORT || 4000, () => {
  console.log("Server has started on 4000");
});

module.exports = app;
