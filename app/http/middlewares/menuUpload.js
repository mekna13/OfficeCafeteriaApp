const multer = require('multer')
const path = require('path')

const Storage = multer.diskStorage({
    destination: 'public/img',
    filename: ( req , file, cb) => {
        cb(null, file.filename+"_"+Date.now()+path.extname(file.originalname))
    }
})

const menuUpload = multer({
    storage: Storage,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if(ext !== '.png'  && ext !== '.jpeg' && ext !== '.jpg') {
            return callback(new Error('Only png and jpeg images are allowed'))
        }
        callback(null, true)
    },
    limits:{
        fileSize: 1024 * 1024
    }
}).single('file')

module.exports = menuUpload