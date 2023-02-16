const express = require('express');
const { register_client, edit_client, get_client, get_clients, get_clientsByFilter, editStatusClient } = require('../../controllers/sales/clientController');
const { auth } = require('../../middlewares/authenticate');
const { validateClient } = require('../../middlewares/validator/sales/client');

const app = express.Router();

app.post('/client', [validateClient, auth], register_client);
app.put('/client/:id', [validateClient, auth], edit_client);
app.get('/client/:id', auth, get_client);
app.get('/clients/:page?', auth, get_clients);
app.get('/clients/search/:filter/:page?', auth, get_clientsByFilter);
app.put('/client/status/:id', auth, editStatusClient);

module.exports = app;