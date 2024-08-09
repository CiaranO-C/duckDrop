const { Router } = require("express");
const { isUser } = require("../controllers/authenticate");
//const userController = require('../controllers/userController');
const multer = require("multer");
const { prisma } = require("../config/prisma");
const upload = multer({ dest: "multer-uploads/" });

const userRouter = Router();

userRouter.use(isUser);

userRouter.get("/", async (req, res) => {
    const rootFolder = await prisma.folder.findFirst({
        where: {
          ownerId: req.user.id,
          isRoot: true,
        },
      });
      res.redirect(`/user/folder/${rootFolder.id}`);
});

userRouter.get("/folder/:id", async (req, res, next) => {
  const folder = await prisma.folder.findUnique({
    where: { id: Number(req.params.id) },
  });
  const openModal = req.query.create === "true";
  res.render("dashboard", {
    currentFolder: folder,
    modal: openModal,
  });
});

userRouter.get("/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

userRouter.get("/upload", (req, res, next) => {
  res.render("upload-form");
});

userRouter.post("/upload", upload.single("userfile"), (req, res, next) => {
  console.log(req.file);
  res.render("upload-form");
});
userRouter.get("/:id/new-folder");
userRouter.post("/:id/new-folder", async (req, res, next) => {
  const createFolder = await prisma.folder.create({
    data: {
      ownerId: req.user.id,
      title: req.body.title,
      parentId: req.params.id,
    },
  });
  res.redirect("/drive");
});

module.exports = userRouter;
