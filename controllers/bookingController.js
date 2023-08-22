const Booking = require('../models/Booking');
const Car = require('../models/Car');
const moment = require('moment');

  
exports.createBooking = async (req, res) => {
    const { car, startDate, endDate, totalPrice, customerName, email, phoneNumber } = req.body;
  
    try {
        const newBooking = new Booking({
            car,
            startDate,
            endDate,
            totalPrice,
            paymentStatus: true, // assuming payment is successful
            customerName,
            email,
            phoneNumber,
          });
  
      const savedBooking = await newBooking.save();
      res.json(savedBooking);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating booking", error: error.message });
    }
};

  
exports.getAllBookings = async (req, res) => {
  const bookings = await Booking.find().populate('car');
  res.send(bookings);
};

exports.getBookingById = async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('car');
  
  if (!booking) {
    return res.status(404).send();
  }
  
  res.send(booking);
};

exports.updateBooking = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['startDate', 'endDate', 'totalPrice', 'paymentStatus', 'customerName', 'phoneNumber', 'email'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  const booking = await Booking.findById(req.params.id);
  
  if (!booking) {
    return res.status(404).send();
  }

  updates.forEach((update) => booking[update] = req.body[update]);
  await booking.save();

  res.send(booking);
};

exports.deleteBooking = async (req, res) => {
  const booking = await Booking.findByIdAndDelete(req.params.id);
  
  if (!booking) {
    return res.status(404).send();
  }
  
  res.send(booking);
};
