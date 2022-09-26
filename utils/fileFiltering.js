const multer = require('multer');

const fileFiltering = (req, file, cb) =>{
    if(file.mimetype === "image/png" || file.mimetype === "image/jpeg" || file.mimetype === "image/jpg"){
        cb(null, true)
    } else {
        const error = new Error('Unsupported file format. Only png,jpeg,jpg are allowed')
        error.statusCode = 500;
        throw error
    }
}

module.exports = fileFiltering;