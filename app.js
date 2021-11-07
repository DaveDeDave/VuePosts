const express = require('express');
const cookieParser = require('cookie-parser');
const db = require('./db/db');
const auth = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
const user = require('./api/user');
const post = require('./api/post');
const comment = require('./api/comment');
const app = express();
const path = require('path');

// EXPRESS SETTINGS
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static('dist'));
app.disable('x-powered-by');

// ROUTING
app.use('/api/user', user);
app.use('/api/post', post);
app.use('/api/comment', comment);
app.use(errorHandler);

// DEFAULT RESPONSE FOR INVALID URL
app.all('*', auth.optional, (req, res, next) => {
  res.sendFile(path.resolve('./dist/index.html'));
});

// SQLITE
db.init().catch((e) => {
  console.log(e);
  process.exit(0);
});

// EXPRESS PORT LISTEN
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started succesfully at localhost:${process.env.PORT || 3000}`)
});