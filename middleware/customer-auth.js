const customer = (req, res, next) => {
  if (req.session.user.role == "customer") {
    next();
  } else {
    res.status(401).send("Invalid credentials. This access is for CUSTOMERS only. ");
  }
};

module.exports = customer;
