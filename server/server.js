const app = require('./app')
const mongoose = require('mongoose')
const cloudinary = require('cloudinary')

const dotenv = require('dotenv')

dotenv.config()
// vbrzLhoEUkmLGcpw


// Clodinary Config
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_API_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});


const database = process.env.DB_URL

mongoose.connect(database).then(()=>{
    console.log("Database Connected");
}).catch((err)=>{
    console.log("Error",err);
})

app.listen(process.env.PORT | 5000,()=>{
    console.log("Port is listening on port 5000....");
})
