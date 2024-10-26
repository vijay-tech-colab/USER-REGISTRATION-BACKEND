const mongoose = require('mongoose');
const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_CLOUD_URL);
        console.log('database stablished !');
    } catch (error) {
        console.log('Database :' ,error);
        process.exit
    }    
}

module.exports = dbConnection;