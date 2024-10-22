const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: [3, "username must be at least 3 character"],
        maxlegnth: [15, "username must be maximum 15 character"],
    },
    email: {
        unique: true,
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: [5, "password must be at least 5 character"],
        maxlegnth: [15, "password must be maximum 15 character"],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
});
userSchema.pre("save", async function (next) {
    const user = this;
    try {
        if (!user.isModified("password")) {
            return next();
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(user.password, salt);
        this.password = hashPassword;
        next();
    } catch (error) {
        console.log("Some Error Hashing Password ?", error);
    }
});
userSchema.methods.comparePassword = async function (enteredPassword) {
    try {
        return await bcrypt.compare(enteredPassword, this.password);
    } catch (error) {
        console.log("Some Error Hashing Password ?", error);
    }
};
userSchema.methods.generateToken = function () {
    return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN});
};
const User = new mongoose.model("USER", userSchema);
module.exports = User;
