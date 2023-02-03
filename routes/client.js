const express = require('express');
const clientController = require('../controllers/clientController');
const auth = require('../middlewares/authenticate');

const app = express.Router();

app.post('/client', auth.auth, clientController.register_client);
app.put('/client/:id', auth.auth, clientController.edit_client);
app.get('/client/:id', auth.auth, clientController.get_client);
app.get('/clients/:page?', auth.auth, clientController.get_clients);
app.get('/clients/search/:filter/:page?', auth.auth, clientController.get_clientsByFilter);
app.put('/client/status/:id', auth.auth, clientController.editStatusClient);

module.exports = app;