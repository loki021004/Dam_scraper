require('dotenv').config();
const express = require('express');

const app = express();
const cors = require('cors')
const connection = require('./db')
const userRoutes = require('./router/users')
const authRoutes = require('./router/auth')
const damRoutes = require('./router/damRouter');

connection();

app.use(express.json())
app.use(cors())

app.use("/api/users",userRoutes)
app.use("/api/auth",authRoutes)
app.use('/ourdams',damRoutes);

const port = process.env.PORT || 5000;
app.listen(port, ()=>console.log(`Listening on port ${port}...`))