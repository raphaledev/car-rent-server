const Car = require('../models/Car')
const Booking = require('../models/Booking')
const express = require('express');
const moment = require('moment');
const fileUpload = require('express-fileupload');
const app = express();

app.use(fileUpload());

//création d'une voiture
module.exports.addCar = async (req,res) =>{
    const newCar = new Car(req.body);
    try {
        const savedCar = await newCar.save();
        res.status(200).json(savedCar);
    } catch (err) {
        res.status(500).json(err);
    }
}

exports.checkAvailability = async (req, res) => {
    const { startDate, endDate } = req.query;
    const carId = req.params.id;

    try {
        const bookings = await Booking.find({ 
            car: carId,
            startDate: { $lte: new Date(endDate) },
            endDate: { $gte: new Date(startDate) },
        });

        if (bookings.length > 0) {
            res.status(200).json({ isAvailable: false });
        } else {
            res.status(200).json({ isAvailable: true });
        }
    } catch(err) {
        res.status(500).json({ message: `Error checking availability: ${err}` });
    }
}

// voir toutes les voitures
module.exports.allCars = async (req, res) => {
    const { startDate, endDate } = req.query;
    const cars = await Car.find();

    if (startDate && endDate) {
        const start = moment(new Date(startDate));
        const end = moment(new Date(endDate));
        const availableCars = cars.filter(car => {
            // Check each unavailable date for this car
            for(let i = 0; i < car.unavailableDates.length; i++) {
                let unavailableDate = moment(new Date(car.unavailableDates[i]));
                // If the unavailable date is within the selected range, exclude this car
                if(unavailableDate.isSameOrAfter(start) && unavailableDate.isSameOrBefore(end)) {
                    return false;
                }
            }
            // If no unavailable dates within the range were found, include this car
            return true;
        });

        return res.json(availableCars);
    } else {
        return res.json(cars);
    }
};
    

//voir une voiture en particulier
module.exports.showCar = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        res.status(200).json(car)
    }
    catch(err){
        res.status(500).json(`message : ${err}`)
    }
}

//mettre à jour une voiture
module.exports.updateCar = async (req , res) => {
    try{
        const car = await Car.findByIdAndUpdate(
            {_id : req.params.id} ,
            {
                $set: {
                    brand: req.body.brand,
                    model: req.body.model,
                    year: req.body.year,
                    energy: req.body.energy,
                    desc: req.body.desc,
                    photos: req.body.photos,
                    price: req.body.price
                }
            },
            { new : true},
        );
        res.status(200).json({
            message: 'Update car',
            car
        })
        console.log(car)
    } catch (err) {
        res.status(500).send({ message: err });
        }
}

//Suppression voiture
module.exports.deleteCar = async (req, res) => {
    try {
        const car = await Car.remove({_id: req.params.id}).exec();
        res.status(200).json({
            message: 'Car removed !',
            car
        });
        
    } catch (error) {
        res.status(500).json({
            message: 'Error when removing car',
            error
        })
    }
}
