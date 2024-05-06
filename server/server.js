const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');   
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

  
//import routes
const authRoutes = require('./routes/auth'); 
const userRoutes = require('./routes/user');

//app middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors()) // allows all origins

// if(process.env.NODE_ENV == 'development') {
//     app.use(cors({origin: `http://localhost:5173`}))
// }

//middleware
app.use('/api', authRoutes)
app.use('/api', userRoutes)


const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
}); 
