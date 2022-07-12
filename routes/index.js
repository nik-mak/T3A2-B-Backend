const express = require("express");
const router = express.Router();
const session = require("express-session");
const MongoStore = require("connect-mongo");

const authRoutes = require("./auth-routes");
const itemRoutes = require("./item_routes");
const cartRoutes = require("./cart-routes");
const userRoutes = require("./user-routes");
const adminRoutes = require("./admin-routes");

const auth = require("../middleware/authenticate");
const adminAuth = require("../middleware/admin-auth");

const ItemModel = require("../models/item");

const sessionConfig = {
  name: "UID", // name of cookie
  secret: process.env.COOKIE_SECRET, // secret that makes the cookie effective
  cookie: {
    maxAge: 1000 * 60 * 60, // time span of cookie in ms
    secure: false, // set to true in production for HTTPS only access
    httpOnly: true, // doesn't allow access from js in browser
  },
  resave: false,
  saveUninitialized: true, // set to false in production, user has to give consent
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_STORE_URI,
    autoRemove: "interval",
    autoRemoveInterval: 60,
  }),
};

router.use(session(sessionConfig));

// Display full catalogue of available items on the home page
router.get("/", (req, res) => {
  ItemModel.find({ sold: false })
    .then((items) => res.send(items))
    .catch((err) => res.status(502).send({ error: err.message }));
});

router.use("/auth", authRoutes);
router.use("/items", auth, itemRoutes);
router.use("/cart", auth, cartRoutes);
router.use("/user", auth, userRoutes);
router.use("/admin", adminAuth, adminRoutes);

module.exports = router;
