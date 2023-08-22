const express = require('express');
const router = express.Router();

const carController = require("../controllers/carController");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController")
const bookingController = require('../controllers/bookingController');

// Car routes
router.route('/cars')
  .get(carController.allCars)
  .post(carController.addCar);

router.route('/cars/:id')
  .get(carController.showCar)
  .put(carController.updateCar)
  .delete(carController.deleteCar);

router.get('/cars/:id/availability', carController.checkAvailability);

// Booking routes
router.route('/bookings')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router.route('/bookings/:id')
  .get(bookingController.getBookingById)
  .put(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

// User and authentication routes
router.route('/login')
  .post(authController.auth);

router.route('/newUser')
  .post(userController.newUser);

module.exports = router;