const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.info('Connected to the database');
    })
    .catch((err) => {
        console.error(`Error connecting to the database. \n${err}`);
    });

 

const port = process.env.PORT || 8000

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
}); 