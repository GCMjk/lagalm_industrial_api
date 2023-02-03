const Employee = require('../models/Employee');
const bcrypt = require('bcrypt-nodejs');
const mongoosePaginate = require('mongoose-pagination')

const validateDate = require('validate-date');
const validateEmail = require('email-validator');
const { isValidPhone } = require('valid-phone-number');
const validateCurp = require('curp');
const validateRfc = require('validate-rfc');
const validateAccountNumber = require('card-validator');

const jwt = require('../helpers/jwt');

const register_employee = async (req, res) => {
    if(req.user) {
        let data = req.body;

        let birthday = data.birthday;
        let email = data.email;
        let phone = data.phone;
        let curp = data.curp;
        let rfc = data.job.rfc;
        let accountNumber = data.job.accountNumber;
        
        let employeeNumber = data.job.employeeNumber;

        try {

            var employees = await Employee.find({ email: data.email });

            bcrypt.hash(`${employeeNumber}`, null, null, async (err, hash) => {
                if(err) {
                    res.status(200).send({message: 'No se pudo generar la contraseña.', employee: undefined});
                } else {

                    if(employees.length >= 1) {
                        res.status(200).send({ message: 'El correo electronico ya fue registrado. Intente con otro.', employee: undefined });
                    }

                    if (!validateDate(birthday, responseType="boolean", dateFormat="yyyy-mm-dd")) return res.status(200).send({ message: 'El formato de la fecha es inválido.', employee: undefined });
                    if (!validateEmail.validate(email)) return res.status(200).send({ message: 'El formato del correo es inválido.', employee: undefined });
                    if (!isValidPhone(52, phone)) res.status(200).send({ message: 'El número telefonico es inválido.', employee: undefined });
                    if (!validateCurp.validar(curp)) return res.status(200).send({ message: 'El CURP es inválido.', employee: undefined });;
                    if (!validateRfc(rfc).isValid) return res.status(200).send({ message: 'El RFC es inválido.', employee: undefined });
                    if (!validateAccountNumber.number(accountNumber).isValid) return res.status(200).send({ message: 'El numero de cuenta es inválido.', employee: undefined });

                    data.fullnames = data.name + ' ' +data.lastname;
                    data.password = hash;
                    let employee = await Employee.create(data);
                    res.status(201).send({ message: 'Empleado creado correctamente.', employee });

                }
            });
            
        } catch (e) {
            res.status(400).send({message: 'Verifique los datos registrados.', employee: undefined});
        }
    } else {
        res.status(403).send({message: 'No hay un token válido para esta petición.', employee: undefined});
    }
}

const edit_employee = async (req, res) => {
    if(req.user) {
        let id = req.params.id;
        let data = req.body;

        let birthday = data.birthday;
        let email = data.email;
        let phone = data.phone;
        let curp = data.curp;
        let rfc = data.job.rfc;
        let accountNumber = data.job.accountNumber;

        let employeeNumber = data.job.employeeNumber;

        var employees = await Employee.find({ email: data.email });

        bcrypt.hash(`${employeeNumber}`, null, null, async (err, hash) => {
            if(err) {
                res.status(200).send({message: 'No se pudo generar la contraseña.', employee: undefined});
            } else {

                if( employees.length >= 1 ) {
                    res.status(200).send({ message: 'El correo electronico ya fue registrado. Intente con otro.', employee: undefined });
                } 
                
                if (!validateDate(birthday, responseType="boolean", dateFormat="yyyy-mm-dd")) return res.status(200).send({ message: 'El formato de la fecha es inválido.', employee: undefined });
                if (!validateEmail.validate(email)) return res.status(200).send({ message: 'El formato del correo es inválido.', employee: undefined });
                if (!isValidPhone(52, phone)) res.status(200).send({ message: 'El número telefonico es inválido.', employee: undefined });
                if (!validateCurp.validar(curp)) return res.status(200).send({ message: 'El CURP es inválido.', employee: undefined });;
                if (!validateRfc(rfc).isValid) return res.status(200).send({ message: 'El RFC es inválido.', employee: undefined });
                if (!validateAccountNumber.number(accountNumber).isValid) return res.status(200).send({ message: 'El numero de cuenta es inválido.', employee: undefined });

                let employee = await Employee.findByIdAndUpdate({ _id: id }, {
                    name: data.name,
                    lastname: data.lastname,
                    fullnames: data.name + ' ' +data.lastname,
                    birthday: data.birthday,
                    gender: data.gender,
                    maritalStatus: data.maritalStatus,
                    curp: data.curp,
                    address: {
                        street: data.address.street,
                        exterior: data.address.exterior,
                        interior: data.address.interior,
                        neighborhood: data.address.neighborhood,
                        city: data.address.city,
                        municipality: data.address.municipality,
                        state: data.address.state,
                        country: data.address.country,
                        zip: data.address.zip,
                        streets: {
                            a: data.address.streets.a,
                            b: data.address.streets.b,
                        }
                    },
                    email: data.email,
                    password: hash,
                    phone: data.phone,
                    role: data.role,
                    job: {
                        employeeNumber: data.job.employeeNumber,
                        rfc: data.job.rfc,
                        schooling: data.job.schooling,
                        nss: data.job.nss,
                        workArea: {
                            area: data.job.area,
                            range: data.job.range,
                        },
                        description: data.job.description,
                        schedule: {
                            start: data.job.schedule.start,
                            end: data.job.schedule.end
                        },
                        salary: data.job.salary,
                        accountNumber: data.job.accountNumber,
                    }
                });
                res.status(200).send({ message: 'El empleado ah sido actualizado correctamente.', employee });
                
            }
        });

    } else {
        res.status(403).send({message: 'No hay un token válido para esta petición.', employee: undefined});
    }
}

const get_employee = async (req, res) => {
    if (req.user) {
        let id = req.params['id'];
        
        try {
            let employee = await Employee.findById({ _id: id });
            res.status(200).send({ employee }); 
        } catch (error) {
            res.status(200).send({ message: 'El id del usuario no es válido.', employee: undefined }); 
        }

    } else {
        res.status(403).send({message: 'No hay un token válido para esta petición.', employee: undefined});
    }
}

const get_employees = async (req, res) => {
    if (req.user) {
        var itemsPerPage = 20;
        if(req.params.page) {
            var page = req.params.page;
        } else {
            var page = 1;
        }

        await Employee.find().sort('job.employeeNumber').paginate(page, itemsPerPage, (err, employees, total) => {
            if(err) {
                res.status(500).send({ message: 'Error en la petición.' });
            } else {
                if(!employees) {
                    res.status(404).send({ message: 'No hay empleados en la base de datos', employees: undefined })
                } else {
                    res.status(200).send({
                        itemsPerPage,
                        total, 
                        pages: Math.ceil(total/itemsPerPage), 
                        employees 
                    });
                }
            }
        });
    } else {
        res.status(403).send({message: 'No hay un token válido para esta petición.', employees: undefined});
    }
}

const get_employeesByFilter = async (req, res) => {
    if (req.user) {

        let filter = req.params.filter;

        const itemsPerPage = 20;
        if(req.params.page) {
            var page = req.params.page;
        } else {
            var page = 1;
        }

        await Employee.find({ 
            $or: [
                { fullNames: new RegExp(filter, 'i') },
                { email: new RegExp(filter, 'i') },
                { "job.employeeNumber": new RegExp(filter, 'i') },
                { "job.workAreaId": new RegExp(filter, 'i') },
                { "job.range": new RegExp(filter, 'i') }
            ]}).sort('createdAt').paginate(page, itemsPerPage, (err, employees, total) => {
            if(err) {
                res.status(500).send({ message: 'Error en la petición.' });
            } else {
                if(!employees) {
                    res.status(404).send({ message: 'No hay empleados en la base de datos', employees: undefined })
                } else {
                    res.status(200).send({
                        itemsPerPage,
                        total, 
                        pages: Math.ceil(total/itemsPerPage), 
                        employees 
                    });
                }
            }
        });
    } else {
        res.status(403).send({message: 'No hay un token válido para esta petición.', employees: undefined});
    }
}

const editStatus_employee = async (req, res) => {
    if (req.user) {
        let id = req.params['id'];
        let data = req.body;

        let newState;
        
        if(data.status) {
            newState = false;
        } else if(!data.status) {
            newState = true;
        }

        let employee = await Employee.findByIdAndUpdate({ _id: id }, {
            status: newState
        })

        res.status(200).send({ employee });

    } else {
        res.status(403).send({message: 'No hay un token válido para esta petición.', employee: undefined});
    }
}

const login_employee = async (req, res) => {
    let data = req.body;

    var employees = await Employee.find({ email: data.email });
    
    if(employees.length >= 1) {
        if(employees[0].status) {
            bcrypt.compare(data.password, employees[0].password, async (err, check) => {
                if(check) {
                   const updated = await Employee.findOneAndUpdate({ email: data.email }, { lastSession: new Date() });
                    res.status(201).send({ message: `Bienvenido ${employees[0].fullnames}`, employee: employees[0], token: jwt.createToken(employees[0]), lastSession: updated.lastSession });
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
    register_employee,
    edit_employee,
    get_employee,
    get_employees,
    get_employeesByFilter,
    login_employee,
    editStatus_employee
}