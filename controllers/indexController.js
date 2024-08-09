const { body, validationResult } = require("express-validator");
const { prisma } = require("../config/prisma");
const bcrypt = require("bcryptjs");

function getHome(req, res, next) {
  res.send("home page");
}

function getLogin(req, res, next) {
  res.render("login-form");
}

const postLogin = [body("username"), body("password"), (req, res, next) => {}];

function getSignUp(req, res, next) {
  res.render("sign-up-form");
}

const postSignUp = [
  body("username")
    .notEmpty()
    .withMessage("Username required")
    .trim()
    .isAlphanumeric()
    .withMessage("Username cannot contain special characters")
    .custom(async (value) => {
      const user = await prisma.user.findUnique({ where: { username: value } });
      if (user) {
        throw new Error("Username already in use");
      }
      return true;
    })
    .escape(),
  body("email")
    .notEmpty()
    .withMessage("Email required")
    .trim()
    .isEmail()
    .withMessage("Invalid email")
    .custom(async (value) => {
      const user = await prisma.user.findUnique({ where: { email: value } });
      if (user) {
        throw new Error("Email already in use");
      }
      return true;
    }),
  body("password")
    .notEmpty()
    .withMessage("Password required")
    .isStrongPassword({
      minLength: 5,
      minSymbols: 0,
    }),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Please confirm password")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  async (req, res, next) => {
    const { username, email, password } = req.body;

    const err = validationResult(req);

    if (!err.isEmpty()) {
      return res.render("sign-up-form", {
        errors: err.array({ onlyFirstError: true }),
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username: username,
        email: email,
        password: hash,
      },
    });

    const userDrive = await prisma.folder.create({
      data: {
        ownerId: newUser.id,
        title: "DuckDrive",
        isRoot: true,
      },
    });
    console.log(newUser, userDrive);
    res.redirect("/login");
  },
];

module.exports = { getHome, getLogin, postLogin, getSignUp, postSignUp };
