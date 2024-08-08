const session = require("express-session");
const { sessionStore } = require('./prisma');

const sessionConfig = session({
  store: sessionStore,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, //ms
  },
});

module.exports = sessionConfig;