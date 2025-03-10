const mongoose = require("mongoose");

require("dotenv").config();

const dbconnect = () => {
    mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    .then(() => console.log("Database connect successfully"))
    .catch( (error) => {
        console.log("error recived in database connection function");
        console.error(error.message);
        process.exit(1);
    })
} 

module.exports = dbconnect;