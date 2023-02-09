const express = require('express');
const productController = require('../controllers/productController');
const auth = require('../middlewares/authenticate');

const app = express.Router();

app.post('/product', auth.auth, productController.register_product);
app.put('/product/:id', auth.auth, productController.edit_product);
app.get('/product/:id', auth.auth, productController.get_product);
app.get('/products/:page?', auth.auth, productController.get_products);
app.get('/products/search/:id/:page?', auth.auth, productController.get_productsByClient);
app.put('/product/status/:id', auth.auth, productController.editStatusProduct);

module.exports = app;