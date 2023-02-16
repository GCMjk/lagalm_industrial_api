const express = require('express');
const { 
    register_product, 
    edit_product, 
    get_product, 
    get_products, 
    get_productsByClient, 
    editStatusProduct 
} = require('../../controllers/sales/productController');
const { auth } = require('../../middlewares/authenticate');
const { validateProduct } = require('../../middlewares/validator/sales/product');

const app = express.Router();

app.post('/product', [validateProduct, auth], register_product);
app.put('/product/:id', [validateProduct, auth], edit_product);
app.get('/product/:id', auth, get_product);
app.get('/products/:page?', auth, get_products);
app.get('/products/search/:id/:page?', auth, get_productsByClient);
app.put('/product/status/:id', auth, editStatusProduct);

module.exports = app;