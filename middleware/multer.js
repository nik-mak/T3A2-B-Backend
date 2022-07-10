const multer = require("multer");
const path = require("path");

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "DH uploads"
    }
})

const fileFilter = (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(new Error("Unsupported file type!"), false);
    } else {
        cb(null, true);
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

module.exports = upload