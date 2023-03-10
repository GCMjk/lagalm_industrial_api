const express = require('express');
const {
    register_order,
    edit_order,
    get_order,
    get_orders,
    get_ordersByClient,
    changeStateOrder,
    editStatusOrder
} = require('../../controllers/sales/orderController');
const { auth } = require('../../middlewares/authenticate');
const { validateOrder } = require('../../middlewares/validator/sales/order');

const app = express.Router();

app.post('/order', [validateOrder, auth], register_order);
app.put('/order/:id', [validateOrder, auth], edit_order);
app.get('/order/:id', auth, get_order);
app.get('/orders/:page?', auth, get_orders);
app.get('/orders/search/:client/:page?', auth, get_ordersByClient);
app.put('/order/state/:id', auth, changeStateOrder);
app.put('/order/status/:id', auth, editStatusOrder);

module.exports = app;