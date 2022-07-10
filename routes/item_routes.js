const express = require("express")
const router = express.Router()
const ItemModel = require("../models/item")

const upload = require("../middleware/multer")
const cloudinary = require("cloudinary").v2

router.get("/", async (req, res) => {
    await ItemModel.find()
        .then(items => res.send(items))
        .catch(err => res.status(502).send({ error: err.message }))
})

router.use((req, res, next) => {
    (req.session.user.role == "customer") ? res.status(401).send({ error: "You don't have access!" }) : next()
})

router.get("/:id", async (req, res) => {
    await ItemModel.findById(req.params.id)
        .then(item => res.send(item))
        .catch(err => res.status(404).send({ error: `Enable to find item with id ${req.params.id}`}))
})

router.post("/add", upload.single("image"), async (req, res) => {
    const imageUploaded = await cloudinary.uploader.upload(req.file.path);

    await ItemModel.create({
        name: req.body.name,
        price: req.body.price,
        size: req.body.size,
        image: imageUploaded.secure_url,
        imageId: imageUploaded.public_id,
        sold: req.body.sold
    })
        .then((item) => res.status(201).send(item))
        .catch((err) => res.status(400).send({ error: err.message }))
})

router.put("/:id", upload.single("image"), async (req, res) => {
    try {
        const item = await ItemModel.findById(req.params.id)

        if (req.file) {
            await cloudinary.uploader.destroy(item.imageId)
            const imageUploaded = await cloudinary.uploader.upload(req.file.path)
        }        

        await ItemModel.updateOne(
          item,
          {
            name: req.body.name,
            price: req.body.price,
            size: req.body.size,
            image: (imageUploaded.secure_url || item.image),
            imageId: (imageUploaded.public_id || item.imageId),
            sold: req.body.sold,
          },
          {
            returnDocument: "after",
          }
        )
        res.sendStatus(201)
    }
    catch (err) {
        res.status(400).send({ error: err.message })
    }    
})

router.delete("/:id", async (req, res) => {
    try {
        const item = await ItemModel.findById(req.params.id)

        await cloudinary.uploader.destroy(item.imageId)

        await ItemModel.deleteOne(item)
        res.sendStatus(204)
    }
    catch (err) {
        res.status(400).send({ error: err.message })
    }    
})

module.exports = router