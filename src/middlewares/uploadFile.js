const multer = require("multer")
const path = require("path")
const createError = require("http-errors");


const uploadDir = process.env.UPLOAD_FILE || 'public/images/users'
const maxFile = Number(process.env.MAX_FILE_SIZE) || 1024 * 1024 * 2
const fileTypes = process.env.FILE_TYPES || ['jpg', 'jpeg', 'png']

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        const extname = path.extname(file.originalname)
        cb(null, Date.now() + "-" + file.originalname.replace(extname, '') + extname)
    }
})

const fileFilter = (req, file, cb) => {
    const extname = path.extname(file.originalname)
    if (!fileTypes.includes(extname.substring(1))) {
        return cb(createError(400, 'File type not allowed!'))
    }
    cb(null, true)
}

module.exports.upload = multer({ storage: storage, limits: { fieldSize: maxFile }, fileFilter })