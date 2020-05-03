const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const authRoute = require('./routes/auth');
const apiRoute = require('./routes/api');
require('dotenv').config();

// Create server to serve index.html
const app = express();
const http = require('http').Server(app);
const port = process.env.PORT || 3001;

// Connect to mongo
const mongoUrl = process.env.DB_URL;
mongoose.set("useUnifiedTopology", true);
mongoose.connect(mongoUrl, {useNewUrlParser: true});
db = mongoose.connection;

db.on('error', error => {
    console.log(error);
})
db.once('open', () => {
    console.log('MongoDB connected!');
})

// Routing
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  try {
    const _user = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    req.user = _user;
    req.isLogin = true;
    next();
  }
  catch {
    req.isLogin = false;
    next();
  }
})
app.use('/auth', authRoute);
app.use('/', apiRoute);

// Start server listening process.
http.listen(port, () => {
    console.log(`Server listening on port ${port}.`)
})