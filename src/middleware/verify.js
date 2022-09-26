import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const verify = (req, res, next) => {
	// hvatanje auth header-a
	const authHeader = req.headers.authorization;
	try {
		if (!authHeader) {
			return res.status(401).json({ msg: "No token present." });
		}

		// hvatanje tipa headera
		const headerType = authHeader.split(" ")[0];
		if (!headerType === "Bearer") {
			return res.status(401).json({ msg: "Invalid token type." });
		}

		// hvatanje tokena iz headera
		const token = req.headers.authorization.split(" ")[1];

		// potvrđivanje potpisa unutar tokena
		const tokenData = jwt.verify(token, process.env.JWT_SECRET);
		req.currentUser = tokenData;
		next();
	} catch (error) {
		res.status(401).json({ msg: "Invalid token." });
	}
};

export default verify;
