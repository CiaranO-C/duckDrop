function isUser(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.send("you aint a user!");
  }
}

function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "ADMIN") {
    next();
  } else {
    res.send("you ain't an admin suckka!");
  }
}

module.exports = { isUser };
