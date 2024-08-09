const passport = require("passport");
const { Strategy } = require("passport-local");
const { prisma } = require("./prisma");
const bcrypt = require("bcryptjs");

const localStrategy = new Strategy(async (username, password, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) {
      done(null, false, { message: "Username not found" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      done(null, false, { message: "Incorrect password" });
      return;
    }
    //correct login information
    done(null, user);
  } catch (error) {
    done(error);
  }
});

//runs strategy 'verify' function on authenticate
passport.use("local", localStrategy);

//populates session object with user id
passport.serializeUser((user, done) => {
  done(null, user.id);
});

//populates request object with user data
passport.deserializeUser(async (userId, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    console.log("in deserialize:", user);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
