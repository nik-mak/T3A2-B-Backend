const customer = (req, res, next) => {
  if (req.session.user.role == "customer") {
    next();
  } else {
    res.status(401).send("Invalid credentials");
  }
};

module.exports = customer;
