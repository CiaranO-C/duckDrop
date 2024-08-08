require("dotenv").config();
const express = require("express");
const path = require("node:path");
//config
const passport = require("./config/passport");
const sessionConfig = require("./config/session");
//routers
const indexRouter = require("./routes/indexRouter");
const userRouter = require("./routes/userRouter");

//const cloudinary = require("./cloud/cloudinaryConfig");
//const multer = require("./config/multer");

const app = express();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use(sessionConfig);
app.use(passport.session()); // checks session for user with each request

app.use("/", indexRouter);
app.use("/user", userRouter);

const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => console.log(`App listening on port: ${PORT}`));
