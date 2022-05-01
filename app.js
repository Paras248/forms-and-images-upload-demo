require("dotenv").config();
const express = require("express");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const app = express();

const { CLOUD_NAME } = process.env;
const { API_KEY } = process.env;
const { API_SECRET } = process.env;

app.set("view engine", "ejs");
//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: "/tmp/",
	})
);

cloudinary.config({
	cloud_name: CLOUD_NAME,
	api_key: API_KEY,
	api_secret: API_SECRET,
});

app.get("/get", (req, res) => {
	console.log(req.query);
	res.send(req.query);
});

app.get("/getForm", (req, res) => {
	res.render("getForm");
});

app.get("/postForm", (req, res) => {
	res.render("postForm");
});

app.post("/post", async (req, res) => {
	console.log(req.body);
	console.log(req.files);

	let file = req.files.fileupload;

	result = await cloudinary.uploader.upload(file.tempFilePath, {
		folder: "users",
	});

	console.log(result);

	const details = {
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		result,
	};

	res.status(201).send(req.body);
});

module.exports = app;
