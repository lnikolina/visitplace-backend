import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./config/db";
import * as EmailValidator from "email-validator";
import User from "./models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import verify from "./middleware/verify";
import Post from "./models/Post";

// pronadi .env file ako postoji
dotenv.config();

const app = express();

// cors omogućuje pozive prema backend-u s bilo koje IP adrese klijenta
app.use(cors());

// korištenje json-a u request i response objektima
app.use(express.json());

// spajanje na bazu
dbConnect();

// uzimanje porta iz varijabli okruženja ( .env file )
const port = process.env.PORT || 3000;

// ruta za registraciju korisnika
app.post("/user", async (req, res) => {
	const { firstName, lastName, email, password } = req.body;

	// provjera podataka sa frontend-a
	if (!firstName || !lastName || !email || !password) {
		return res.status(400).json({ msg: "All fields are required." });
	}

	const validEmail = EmailValidator.validate(email);

	// validacija emaila
	if (!validEmail) {
		return res.status(400).json({ msg: "Email must be valid." });
	}

	// potvrđivanje da korisnik sa istim e-mailom već ne postoji
	const existingUser = await User.findOne({ email: email });

	if (existingUser) {
		return res.status(400).json({ msg: "Email already in use." });
	}

	// generiranje soli za hashiranje
	const salt = await bcrypt.genSalt(10);

	// hashiranje lozinke
	const passwordHash = await bcrypt.hash(password, salt);

	try {
		// kreacija novog korisnika u bazi
		const newUser = new User({
			email: email,
			firstName: firstName,
			lastName: lastName,
			passwordHash: passwordHash,
		});

		// spremanje novog korisnika u bazu
		await newUser.save();

		// priprema podatak koji će biti spremljeni u tokenu
		const payload = {
			userID: newUser._id,
		};
		// potpisani token
		const token = jwt.sign(payload, process.env.JWT_SECRET, {
			algorithm: "HS512",
			expiresIn: "7d",
		});
		res.json({ token });
	} catch (error) {
		res.status(500).send("Server Error");
	}
});

app.post("/auth", async (req, res) => {
	const { email, password } = req.body;

	//provjera podataka s frontend-a

	if (!email || !password) {
		return res.status(400).json({ msg: "All fields are required." });
	}

	try {
		// pronalazak korisnika s dobivenim email-om
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ msg: "Invalid credentials." });
		}

		// provjera točnosti lozinke
		const passwordMatch = await bcrypt.compare(password, user.passwordHash);

		if (!passwordMatch) {
			return res.status(400).json({ msg: "Invalid credentials." });
		}

		const payload = {
			userID: user._id,
		};

		const token = jwt.sign(payload, process.env.JWT_SECRET, {
			algorithm: "HS512",
			expiresIn: "7d",
		});
		res.json({ token });
	} catch (error) {
		res.status(500).send("Server Error");
	}
});

app.get("/user", verify, async (req, res) => {
	try {
		// hvatanje podataka trenutnog korisnika
		const user = await User.findById(req.currentUser.userID);
		res.json(user);
	} catch (error) {
		res.status(500).json({ msg: "Server Error" });
	}
});

app.post("/posts", verify, async (req, res) => {
	const { location, photoURL } = req.body;

	// provjera podataka sa frontend-a
	if (!location || !photoURL) {
		return res.status(400).json({ msg: "All fields are required." });
	}
	try {
		// kreacija novog posta
		const newPost = new Post({
			location: location,
			photoURL: photoURL,
			user: req.currentUser.userID,
		});

		// spremanje novog posta u bazu
		await newPost.save();

		res.json(newPost);
	} catch (error) {
		res.status(500).json({ msg: "Server Error" });
	}
});

app.listen(port, () => console.log(`Slušam na portu ${port}`));
