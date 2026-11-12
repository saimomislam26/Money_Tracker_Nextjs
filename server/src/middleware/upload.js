const multer = require('multer')
const os = require('os')

module.exports = multer({
  storage: multer.diskStorage({ destination: os.tmpdir() }),
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(file.mimetype.startsWith('image/') ? null : new Error('Only images are allowed'), file.mimetype.startsWith('image/')),
}).single('avatar')
