const multer = require('multer');

// Configure storage options (optional)
// Here, we use the default configuration which stores files in memory
const storage = multer.diskStorage({});

// Initialize Multer with the defined storage configuration
const upload = multer({ storage });

// Middleware to handle single file uploads
const uploadSingleFile = upload.single('myFile');

module.exports.uploadSingleFile = uploadSingleFile;