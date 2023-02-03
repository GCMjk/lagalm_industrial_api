const express = require('express');
const employeeController = require('../controllers/employeeController');
const auth = require('../middlewares/authenticate');

const app = express.Router();

app.post('/employee', auth.auth, employeeController.register_employee);
app.put('/employee/:id', auth.auth, employeeController.edit_employee);
app.get('/employee/:id', auth.auth, employeeController.get_employee);
app.get('/employees/:page?', auth.auth, employeeController.get_employees);
app.get('/employees/search/:filter/:page?', auth.auth, employeeController.get_employeesByFilter);
app.put('/employee/status/:id', auth.auth, employeeController.editStatus_employee);
app.post('/login', employeeController.login_employee);

module.exports = app;