const express = require("express");
const router = express.Router();
const ItemModel = require("../models/item");
const upload = require("../middleware/multer");
const cloudinary = require("cloudinary").v2;

router.get("/:id", async (req, res) => {
  try {
    await ItemModel.findById(req.params.id);
    res.status(200).send(item);
  } catch (err) {
    res
      .status(400)
      .send({ error: `Enable to find item with id ${req.params.id}` });
  }
});

router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const imageUploaded = await cloudinary.uploader.upload(req.file.path);

    const item = await ItemModel.create({
      name: req.body.name,
      price: req.body.price,
      size: req.body.size,
      image: imageUploaded.secure_url,
      imageId: imageUploaded.public_id,
      sold: req.body.sold,
    });
    res.status(201).send(item);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
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
