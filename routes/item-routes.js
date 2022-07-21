const express = require("express");
const router = express.Router();
const ItemModel = require("../models/item");
const upload = require("../middleware/multer");
const cloudinary = require("cloudinary").v2;

// returns an individual item by its id
router.get("/:id", async (req, res) => {
  try {
    await ItemModel.findById(req.params.id);
    res.status(200).send(item);
  } catch (err) {
    res
      .status(404)
      .send({ error: `Enable to find item with id ${req.params.id}` });
  }
});

// adds a new item to catalogue
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) throw "Image not uploaded successfully!"
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
  } catch (error) {
    res.status(400).send({ error });
  }
});

// update an individual item
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const item = await ItemModel.findById(req.params.id);
    // only updates item image if a new file has been sent
    if (req.file) {
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
          runValidators: true,
          returnDocument: "after",
        }
      );
    } else {
      await ItemModel.updateOne(item, req.body, {
        runValidators: true,
        returnDocument: "after",
      });
    }
    res.status(201).send("Item updated successfully!");
  } catch (error) {
    res.status(400).send( error);
  }
});

// deletes an item from the catalogue and
// removes its image from cloudinary
router.delete("/:id", async (req, res) => {
  try {
    const item = await ItemModel.findById(req.params.id);

    await cloudinary.uploader.destroy(item.imageId, function (error, result) {
      console.log(result, error);
    });

    await ItemModel.deleteOne(item);
    res.status(204).send("Item deleted successfully!");
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

module.exports = router;
