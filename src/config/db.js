import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// funckija koja povezuje backend i bazu
const dbConnect = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("Uspješno spajanje na bazu");
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
};

export default dbConnect;
