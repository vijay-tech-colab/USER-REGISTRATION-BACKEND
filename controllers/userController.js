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
        const isEmailExist = await User.findOne({email}).select('+password');
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

        res.status(201).cookie('token', token, {
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

exports.login = async (req,res) => {
    const {email,password} =req.body;
    if(!email || !password){
        return res.status(400).json({
            success : false,
            message : "All Field required !",
        })
    }
    const user = await User.findOne({email}).select('+password');
    if(!user){
        return res.status(400).json({
            success : false,
            message : "email not found !",
        })
    }
    const isPasswordMatch = await user.comparePassword(password);
    if(!isPasswordMatch){
        return res.status(400).json({
            success : false,
            message : "Incorrect username or password",
        })
    }
    const token =  user.generateToken();
    res.status(201).cookie('token', token, {
        maxAge: 24 * 60 * 60 * 1000, // Expires after 1 day
        httpOnly: true, // Accessible only by web server (not JavaScript)
        secure: false, // Set to `true` if using HTTPS
        sameSite: 'strict', // Prevents CSRF attacks
      }).json({
        success : true,
        message : "Login successful 😁",
        user,
        token
    })
}
//! get profile
exports.getProfile = async (req,res) => {
    const userId = req.user;
    const userProfile = await User.findOne({_id : userId}).select('+password');
    res.status(201).json({
        success : true,
        userProfile
    }) 
}