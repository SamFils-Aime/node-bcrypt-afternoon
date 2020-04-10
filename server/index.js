require('dotenv').config();
const express = require('express');
const session = require('express-session');
const massive = require('massive');
const authCtrl = require('./controllers/authController');
const teaCtrl = require('./controllers/treasureController')
const auth = require('./middleware/authMiddleware.js');

const PORT = 4000;

const { SESSION_SECRET, CONNECTION_STRING } = process.env;

const app = express();

app.use(express.json());

massive(CONNECTION_STRING).then(db => {
  app.set('db', db);
  console.log('db connected');
});

app.use(
  session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET,
  })
);

app.post('/auth/register', authCtrl.register);
app.post('/auth/login', authCtrl.login);
app.get('/auth/logout', authCtrl.logout);

app.get('/api/treasure/dragon', teaCtrl.dragonTreasure)
app.get('/api/treasure/user', auth.usersOnly, teaCtrl.getUserTreasure);
app.post('/api/treasure/user', auth.usersOnly, teaCtrl.addUserTreasure);
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, teaCtrl.getAllTreasure);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));