const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const damRoutes = require('./router/damRouter');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json())

app.use('/ourdams',damRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URL)
    .then(()=>app.listen(PORT,()=>console.log(`Server running on port ${PORT}`)))
    .catch(err =>console.error(err));