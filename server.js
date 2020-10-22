//Entry File
const express = require('express');
const connectDB = require('./config/db');

const app = express();

//Connect to Database (MongoDB)
connectDB();

//Init Middleware
app.use(express.json({ extended: false })); //express.json() use to be bodyParser.json

app.get(`/`, (req, res) => res.send('API Running'));

//Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/post', require('./routes/api/post'));
app.use('/api/profile', require('./routes/api/profile'));

const PORT = process.env.PORT || 5000; //gets the port number (when deployed variable 'PORT' will get from environment else it's port 5000)

app.listen(PORT, () => console.log(`Server Started on port: ${PORT}`));
