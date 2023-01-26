const Employee = require('../models/Employee');
const bcrypt = require('bcrypt-nodejs');

const jwt = require('../helpers/jwt');

const register_employee_admin = async (req, res) => {
    let data = req.body;
    try {

        var employees = await Employee.find({ email: data.email });

        bcrypt.hash('123456', null, null, async (err, hash) => {
            if(err) {
                res.status(200).send({message: 'No se pudo generar la contraseña.', employee: undefined});
            } else {
                if(employees.length >= 1) {
                    res.status(200).send({ message: 'El correo electronico ya fue registrado. Intente con otro.', employee: undefined });
                } else {
                    data.fullnames = data.name + ' ' +data.lastname;
                    data.password = hash;
                    let employee = await Employee.create(data);
                    res.status(201).send({ message: 'Empleado creado correctamente.', employee });
                }
            }
        });
        
    } catch (e) {
        res.status(400).send({message: 'Verifique los datos registrados.', employee: undefined});
    }
}

const login_employee_admin = async (req, res) => {
    let data = req.body;

    var employees = await Employee.find({ email: data.email });
    
    if(employees.length >= 1) {
        if(employees[0].status) {
            bcrypt.compare(data.password, employees[0].password, async (err, check) => {
                if(check) {
                    employees[0].lastSession = new Date();
                    res.status(201).send({ message: `Bienvenido ${employees[0].fullnames}`, employee: employees[0], token: jwt.createToken(employees[0]) });
                } else {
                    res.status(200).send({ message: 'La contraseña es incorrecta.', employee: undefined });
                }
            });
        } else {
            res.status(200).send({ message: 'El usuario no es valido, comuniquese con el area de soporte.', employee: undefined });
        }
    } else {
        res.status(200).send({ message: 'El correo electronico no existe.', employee: undefined });
    }
}

module.exports = {
    register_employee_admin,
    login_employee_admin
}