const app = require('./app');
const dbConnection = require('./DB/dbConnection');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET,
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME
});

const PORT = process.env.PORT || 3000;
dbConnection();
app.listen(PORT,() => {
    console.log(`server running on ${PORT}`);
})

