const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
	username: String,
	password: String
});

const options = {
	errorMessages: {
		IncorrectPasswordError: 'Password is incorrect',
		IncorrectUsernameError: 'Username is incorrect'
	}
};

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);