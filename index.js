const express = require("express");
require('dotenv').config({ path:'config/.env'})
const allRoutes = require('./routes/allRoutes')
const mongoose = require("mongoose");
const cors = require('cors');
const multer = require("multer");
const path = require("path");

const app = express()
app.use(express.json());
app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

//routes
app.use('/api', allRoutes);

// Testing app root
app.get('/', (req, res) => {
    res.send('APP IS RUNNING')
});


mongoose.connect(process.env.DATABASE_URI, {
    useNewUrlParser: true}).then(() => {
        console.log('Database connection successful')})
    .catch(err => {
        console.error(err.message)})

// files storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    },
});
    
const upload = multer({ storage: storage });
    app.post("/api/upload", upload.single("file"), (req, res) => {
    try {
        return res.status(200).json("File uploaded successfully");
    } catch (error) {
        console.error(error);
    }
});


port = process.env.PORT || 5000;
app.listen(port, ()=>{
    console.log(`Server Running on port ${port}`);
});