const express = require("express");
const router = express.Router();
const ItemModel = require("../models/item");

const upload = require("../middleware/multer");
const cloudinary = require("cloudinary").v2;

// Defining that all following routes are only permitted for staff and admin users
router.use((req, res, next) => {
  req.session.user.role === "customer"
    ? res.status(401).send({ error: "You don't have access!" })
    : next();
});

router.get("/:id", (req, res) => {
  ItemModel.findById(req.params.id)
    .then((item) => res.send(item))
    .catch((err) =>
      res
        .status(404)
        .send({ error: `Enable to find item with id ${req.params.id}` })
    );
});

router.post("/add", upload.single("image"), async (req, res) => {
  const imageUploaded = await cloudinary.uploader.upload(req.file.path);

  ItemModel.create({
    name: req.body.name,
    price: req.body.price,
    size: req.body.size,
    image: imageUploaded.secure_url,
    imageId: imageUploaded.public_id,
    sold: req.body.sold,
  })
    .then((item) => res.status(201).send(item))
    .catch((err) => res.status(400).send({ error: err.message }));
});

router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const item = await ItemModel.findById(req.params.id);
    const imageUploaded = await cloudinary.uploader.upload(req.file.path);

    await ItemModel.updateOne(
      item,
      {
        name: req.body.name,
        price: req.body.price,
        size: req.body.size,
        image: imageUploaded.secure_url,
        imageId: imageUploaded.public_id,
        sold: req.body.sold,
      },
      {
        returnDocument: "after",
      }
    );
    res.sendStatus(201);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const item = await ItemModel.findById(req.params.id);

    await cloudinary.uploader.destroy(item.imageId, function (error, result) {
      console.log(result, error);
    });

    await ItemModel.deleteOne(item);
    res.sendStatus(204);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

module.exports = router;
