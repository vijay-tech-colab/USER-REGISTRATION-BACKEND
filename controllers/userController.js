const User = require('../models/userSchema');
const cloudinary = require('cloudinary').v2;
exports.regstration = async (req,res) => {
    try {
        const {username,email,password} = req.body;
        if(!username || !email || !password){
            return res.status(400).json({
                success : false,
                message : "All Field required !",
            })
        }
        const isEmailExist = await User.findOne({email});
        if(isEmailExist){
            return res.status(400).json({
                success : false,
                message : "email already exits",
            })
        }
        const {avatar} = req.files;
        if(!req.files || Object.keys(req.files).length === 0){
            return res.status(400).json({
                success : false,
                message : "please upload Image",
            })
        }
        const cloudinaryResForAvatar = await cloudinary.uploader.upload(avatar.tempFilePath,{
            folder : "Avatar"
        });
        const user = await User.create({
            username,
            email,
            password,
            avatar :{
                public_id : cloudinaryResForAvatar.secure_url,
                url : cloudinaryResForAvatar.url
            },
        });
        const token =  user.generateToken();

        res.status(201).cookie(`token_${user._id}_${Date.now()}`, token, {
            maxAge: 24 * 60 * 60 * 1000, // Expires after 1 day
            httpOnly: true, // Accessible only by web server (not JavaScript)
            secure: false, // Set to `true` if using HTTPS
            sameSite: 'strict', // Prevents CSRF attacks
          }).json({
            success : true,
            message : "registration successfully 😁",
            user,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : "internal server error 🙄"
        })
    }
}

// ! login functionality 

exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Check if both email and password are provided
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required!",
        });
    }

    try {
        // Find the user by email and include the password field explicitly
        const user = await User.findOne({ email }).select('+password');
        
        // If user is not found
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Email not found!",
            });
        }

        // Compare the provided password with the user's password
        const isPasswordMatch = await user.comparePassword(password);

        // If password doesn't match
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect email or password!",
            });
        }

        // Generate a token for the user
        const token = user.generateToken();

        // Send the token in a cookie and respond with a success message
        res.status(201).cookie(`token_${user._id}_${Date.now()}`, token, {
            maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
            httpOnly: true, // Not accessible via JavaScript
            secure: false, // Should be true if using HTTPS
            sameSite: 'strict', // Prevent CSRF attacks
        }).json({
            success: true,
            message: "Login successful 😁",
            user,  // You might want to exclude password from this response
            token
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error!",
        });
    }
};


//! get profile
exports.getProfile = async (req,res) => {
    const userId = req.user;
    const userProfile = await User.findOne({_id : userId});
    res.status(201).json({
        success : true,
        userProfile
    }) 
}

exports.updateUser = async (req, res) => {
    try {
        const userId = req.user; // Assuming `req.user` contains the logged-in user's ID
        const { username, email } = req.body;

        // Fetch the current user details
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found!",
            });
        }

        // Update fields conditionally
        if (username) {
            user.username = username;
        }

        if (email) {
            // Check if email is already taken by another user
            user.email = email;
        }

        // If avatar image is uploaded, delete the old avatar and upload a new one
        if (req.files && Object.keys(req.files).length > 0) {
            const { avatar } = req.files;

            // If the user already has an avatar, delete it from Cloudinary
            if (user.avatar && user.avatar.public_id) {
                await cloudinary.uploader.destroy(user.avatar.public_id);
            }

            // Upload the new avatar to Cloudinary
            const cloudinaryResForAvatar = await cloudinary.uploader.upload(avatar.tempFilePath, {
                folder: "Avatar",
            });

            // Update user data with new avatar
            user.avatar = {
                public_id: cloudinaryResForAvatar.public_id,
                url: cloudinaryResForAvatar.secure_url,
            };
        }

        // Save the updated user details
        await user.save();

        // Send success response
        res.status(200).json({
            success: true,
            message: "User updated successfully!",
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

exports.changePassword = async (req,res) => {
    try {
        const userId = req.user;
        const {oldPassword,newPassword} = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!",
            });
        }

        const user = await User.findById(userId).select("+password");
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User not found !",
            });
        }
        const isPasswordMatch = await user.comparePassword(oldPassword);
        if(!isPasswordMatch){
            return res.status(400).json({
                success: false,
                message: "Old password and new password isn't match ",
            });
        }
        user.password = newPassword;
        user.save();
        res.status(200).json({
            success: true,
            message: "Password change successfully !",
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

