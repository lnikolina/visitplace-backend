import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
	{
		location: {
			type: String,
			required: true,
			min: 3,
		},
		photoURL: {
			type: String,
			required: true,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "user",
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Post = mongoose.model("post", PostSchema);

export default Post;
