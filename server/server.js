const app = require('./app')
const mongoose = require('mongoose')

const dotenv = require('dotenv')

dotenv.config()
// vbrzLhoEUkmLGcpw

const database = process.env.DB_URL

mongoose.connect(database).then(()=>{
    console.log("Database Connected");
}).catch((err)=>{
    console.log("Error",err);
})

app.listen(process.env.PORT | 5000,()=>{
    console.log("Port is listening on port 5000....");
})