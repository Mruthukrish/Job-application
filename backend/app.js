const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();

app.use(express.json());

const cors = require('cors');
app.use(cors());


//To parse url encoded data(white spcaes, special characters,..)
app.use(bodyParser.urlencoded({ extended: true }));

const job_route = require('../backend/routes/jobs_route');

app.use("/jobs", job_route);

const MONGO_URI = `${process.env.MONGO_URI}`;
const PORT = process.env.PORT || 3000;

mongoose.connect(MONGO_URI)
    .then(
        () =>
            console.log("Connected to mongodb")
    )
    .catch(
        error =>
            console.error("Not connected to mongodb", error)
    )

app.get('/',(req,res)=>{
    res.send("Welcome to mongoDb");
})

app.use((err,req,res,next)=>{
    res.status(500).json({
        success: false,
        message: `Internal server error: ${err.message}`
    });
})

app.listen(PORT, ()=>{
    console.log("Server is running on" ,`${PORT}`)
})
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found 🕵️‍♂️" });
});
