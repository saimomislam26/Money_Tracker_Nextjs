require('dotenv').config()

module.exports = {
  port: process.env.PORT || 5000,
  dbUrl: process.env.DB_URL,
  jwtSecret: process.env.JWT_SECRET_KEY,
  tokenExpires: process.env.TOKEN_EXPIRES_TIME || '7d',
  clientUrls: (process.env.CLIENT_URL || 'http://localhost:3000').split(',').map((s) => s.trim()),
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_API_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
}
