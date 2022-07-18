const store = (req, res, next) => {
  if (req.session.user.role == "staff" || req.session.user.role == "admin") {
    next();
  } else {
    res.status(401).send("Invalid credentials. This access is for STORE MEMBERS only.");
  }
};

module.exports = store;
