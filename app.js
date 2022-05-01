require("dotenv").config();
const express = require("express");

const app = express();

app.set("view engine", "ejs");
//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/get", (req, res) => {
	console.log(req.body);
	res.send(req.body);
});

module.exports = app;
