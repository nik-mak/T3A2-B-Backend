const paginatedResults = (model) => {
    return async (req, res, next) => {
        const page = parseInt(req.body.page)
        const amount = parseInt(req.body.amount)
        const filter = req.body.filter
        let queryFilter = {}

        const startIndex = (page - 1) * amount
        const endIndex = page * amount

        const query = {}

        if (endIndex < await model.countDocuments()) {
            query.next = {
                page: page + 1,
                amount: amount
            }
        }

        if (startIndex > 0) {
            query.previous = {
                page: page - 1,
                amount: amount
            }
        }

        switch (filter) {
            case "recent":
                queryFilter = { _id: -1 }
                break
            case "price(high - low)":
                queryFilter = { price: -1 };
                break
            case "price(low - high)":
                queryFilter = { price: 1 };
                break
        }

        try {
          // Displays most recent items first
          query.results = await model
            .find({ sold: false }, ["name", "price", "image", "size"])
            .limit(amount)
            .skip(startIndex)
            .sort(queryFilter)
          res.paginatedResults = query;
          next();
        } catch (err) {
          res.status(400).send({ error: error.message });
        }
    }
}

module.exports = paginatedResults