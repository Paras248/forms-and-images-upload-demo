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
	// case - multiple images

	let result;
	let imageArray = [];

	if (req.files) {
		for (let index = 0; index < req.files.fileupload.length; index++) {
			let result = await cloudinary.uploader.upload(
				req.files.fileupload[index].tempFilePath,
				{
					folder: "users",
				}
			);

			imageArray.push({
				public_id: result.public_id,
				secure_url: result.secure_url,
			});
		}
	}

	// ### use case for single files
	//let file = req.files.fileupload;
	// result = await cloudinary.uploader.upload(file.tempFilePath, {
	// 	folder: "users",
	// });

	const details = {
		firstName: req.body.firstname,
		lastName: req.body.lastname,
		result,
		imageArray,
	};

	res.status(201).send(details);
});

module.exports = app;
