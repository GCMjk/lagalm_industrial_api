const express = require('express');
const orderController = require('../controllers/orderController');
const auth = require('../middlewares/authenticate');

const app = express.Router();

app.post('/order', auth.auth, orderController.register_order);

module.exports = app;