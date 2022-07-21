const admin = (req, res, next) => {
  if (req.session.user.role == "admin") {
    next();
  } else {
    res.status(401).send("Invalid credentials. This access is for ADMIN only.");
  }
};

module.exports = admin;
