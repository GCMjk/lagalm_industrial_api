const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeeSchema = Schema({
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    fullnames: { type: String, required: true },
    birthday: { type: String, required: true },
    gender: { type: String, required: true },
    maritalStatus: { type: String, required: false },
    curp: { type: String, required: true },
    address: { type: Object, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: false },
    role: { type: String, required: true },
    avatar: { type: String, required: true },
    job: { type: Object, required: true },
    lastSession: { type: String, default: '', required: false },
    status: { type: Boolean, default: true, required: true }
});

module.exports = mongoose.model('employee', EmployeeSchema);