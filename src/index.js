import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./config/db";

// pronadi .env file ako postoji
dotenv.config();

const app = express();

// cors omogućuje pozive prema backend-u s bilo koje IP adrese klijenta
app.use(cors());

// spajanje na bazu
dbConnect();

// uzimanje porta iz varijabli okruženja ( .env file )
const port = process.env.PORT || 3000;

// test ruta
app.get("/", (req, res) => {
	return res.send("<h1>Hello world</h1>");
});

app.listen(port, () => console.log(`Slušam na portu ${port}`));
