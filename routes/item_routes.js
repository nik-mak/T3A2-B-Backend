const express = require("express")
const router = express.Router()
const ItemModel = require("../db/item_model")

router.get("/", async (req, res) => {
    await ItemModel.find()
        .then(items => res.send(items))
        .catch(err => res.status(502).send({ error: err.message }))
})

router.get("/:id", async (req, res) => {
    await ItemModel.findById(req.params.id)
        .then(item => res.send(item))
        .catch(err => res.status(404).send({ error: `Enable to find item with id ${req.params.id}`}))
})

router.post("/", async (req, res) => {
    await ItemModel.create(req.body)
        .then(item => res.status(201).send(item))
        .catch(err => res.status(400).send({ error: err.message }))
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