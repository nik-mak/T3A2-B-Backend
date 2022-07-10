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
    const imageUrl = await cloudinary.uploader.upload(req.file.path);
    
    await ItemModel.create({
        name: req.body.name,
        price: req.body.price,
        size: req.body.size,
        image: imageUrl.secure_url,
        sold: req.body.sold
    })
        .then((item) => res.status(201).send(item))
        .catch((err) => res.status(400).send({ error: err.message }))
})

router.put("/:id", async (req, res) => {
    await ItemModel.findByIdAndUpdate(req.params.id, req.body, {
        returnDocument: "after",
    })
        .then(item => res.status(201).send(item))
        .catch(err => res.status(400).send({ error: err.message }))
})

router.delete("/:id", async (req, res) => {
    await ItemModel.findByIdAndDelete(req.params.id)
        .then(() => res.sendStatus(204))
        .catch(err => res.status(400).send({ error: err.message }))
})

module.exports = router