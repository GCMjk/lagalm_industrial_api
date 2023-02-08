const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeeSchema = Schema({
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    fullnames: { type: String, required: true },
    birthday: { type: String, required: true },
    gender: { type: String, enum: ["FEMALE", "MALE"], required: true },
    maritalStatus: { type: String, enum: ["SINGLE", "MARRIED", "DIVORCED", "WIDOW"], required: true },
    curp: { type: String, required: true },
    address: { 
        street: { type: String, required: false },
        exterior: { type: String, required: false },
        interior: { type: String, required: false },
        neighborhood: { type: String, required: false },
        city: { type: String, required: false },
        municipality: { type: String, required: false  },
        state: { type: String, required: false },
        country: { type: String, required: false },
        zip: { type: String, match: /^[0-9]+$/, required: false },
        streets: { 
            a: { type: String, required: false },
            b: { type: String, required: false },
        }
    },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: false },
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER", required: true },
    avatar: { type: String, required: false },
    job: { 
        type: {
            employeeNumber: { type: String, required: true },
            rfc: { type: String, required: true },
            schooling: { type: String, enum: ["PRESCHOOL", "MIDDLE SCHOOL", "HIGH SCHOOL", "CAREER TECH", "COLLEGE DEGREE", "ENGINEERING", "MASTERS DEGREE", "DOCTORAL DEGREE", "UNSPECIFIED"], required: true },
            nss: { type: String, required: true },
            workArea: [
                {
                    type: { 
                        area: { type: String, enum: ["DIRECTION", "PURCHASES", "SALES", "QUALITY", "CUSTOMER SERVICE", "PRODUCTION", "IT"], required: true },
                        range: { type: String, enum: ["MANAGER", "ASSISTANT MANAGER", "ASSISTANT", "AUXILIARY", "SHIFT LEADER", "GENERAL ASSISTANT", "OPERATOR"], required: true },
                    }
                }
            ],
            description: { type: String, required: true },
            schedule: {
                type: {
                    start: { type: String, required: true },
                    end: { type: String, required: true },
                }, 
                required: false
            },
            salary: { type: String, required: true },
            accountNumber: { type: String, required: true }
        }, 
        required: true 
    },
    lastSession: { type: String, default: "", required: false },
    status: { type: Boolean, default: true, required: true }
}, { timestamps: true });

module.exports = mongoose.model('employee', EmployeeSchema);