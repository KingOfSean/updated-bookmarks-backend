const {Schema, model} = require("mongoose");

const userSchema = new Schema({
	username: {type: String, required: true, unique: true},
	password: {type: String, required: true},
	bookmarks: [{type: Schema.Types.ObjectId, ref: "Bookmark"}],
});

const User = model("User", userSchema);

module.exports = User;
