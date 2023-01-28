const express = require('express');
const employeeController = require('../controllers/employeeController');
const auth = require('../middlewares/authenticate');

const app = express.Router();

app.post('/employee', auth.auth, employeeController.register_employee_admin);
app.put('/employee/status/:id', auth.auth, employeeController.editStatus_employee);
app.get('/employees/:page?', auth.auth, employeeController.get_employees);
app.post('/login', employeeController.login_employee_admin);

module.exports = app;