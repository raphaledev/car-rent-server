const mongoose = require('mongoose')

const carSchema = new mongoose.Schema({
    brand: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    energy:{
        type: String,
        required: true
    }, 
    desc: {
        type: String,
        required: true
    },
    // // photos: {
    // //     type: [String],
    // //     required: true
    // // }, 
    photos: {
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    unavailableDates: {
        type: [Date],
        required: true,
        default:[]
    }
})

module.exports = mongoose.model('Car', carSchema)