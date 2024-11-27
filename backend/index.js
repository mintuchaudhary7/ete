const express = require("express");
const app = express();
const cors = require('cors');

// load config from env file
require("dotenv").config();

const PORT = process.env.PORT || 4000;

// middleware to parse json request body
app.use(express.json());
app.use(cors());


//connect to the database

const dbConnect = require("./config/database");
dbConnect();

// app.get("/", (req, res) => {
//     res.send("<h1>This is our home Page !!!!</h1>");
// })

// import route for TODO API

const todoRoutes = require("./routes/todos");

app.use("/", todoRoutes);

app.listen(PORT, () => {
    console.log(`Server is running successfully at ${PORT}`);
});