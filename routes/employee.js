const express = require('express');
const employeeController = require('../controllers/employeeController');

const app = express.Router();

app.post('/employee', employeeController.register_employee_admin);
app.post('/login', employeeController.login_employee_admin);

module.exports = app;