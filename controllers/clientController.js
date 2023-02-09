const Client = require('../models/Client');
const bcrypt = require('bcrypt-nodejs');
const mongoosePaginate = require('mongoose-pagination');

const Facturapi = require('facturapi');
const facturapi = new Facturapi('sk_test_AP08J1rxzW9KYE64wvVram2bEOwna52eObVR3lXkdG');

const validateEmail = require('email-validator');
const validateRfc = require('validate-rfc');
const { isValidPhone } = require('valid-phone-number');

const register_client = async (req, res) => {
    if(req.user) {
        let data = req.body;

        try {

            bcrypt.hash('lagalm2023', null, null, async (err, hash) => {

                if(err) {
                    res.status(200).send({message: 'No se pudo generar la contraseña.', client: undefined});
                } else {
                    // Validar formato de correo
                    if (!validateEmail.validate(data.contact.email)) return res.status(200).send({ message: 'El formato del correo de contacto no es inválido.', client: undefined });
                    // Validar si el correo o nombre de la empresa existe
                    const someLegalName = await Client.find({ legalName: data.legalName });
                    const someEmail = await Client.find({ "contact.email": data.contact.email });
                    if( someLegalName.length >= 1 || someEmail.length >= 1 ) {
                        if( someLegalName.length >= 1 ) return res.status(200).send({ message: 'El nombre de la empresa ya fue registrado. Intente con otro.', client: undefined });
                        if( someEmail.length >= 1 ) return res.status(200).send({ message: 'El correo ya fue registrado. Intente con otro.', client: undefined });
                    }
                    // Si viene telefono
                    if( data.contact.phone ) {
                        // Validar formato de telefono
                        if ( !isValidPhone(52, data.contact.phone) ) return res.status(200).send({ message: 'El número telefonico es inválido.', client: undefined });
                    }
                    
                    if( data.type === 'CLIENT' && data.taxId && data.taxSystem && data.taxEmail && data.cfdi && data.paymentForm && data.paymentMethod && data.address.zip ) {
                        // Validar formato RFC
                        if( !validateRfc(data.taxId).isValid ) return res.status(200).send({ message: 'El RFC es inválido.', client: undefined });
                        const someTaxId = await Client.find({ taxId: data.taxId });
                        if( someTaxId.length >= 1 ) return res.status(200).send({ message: 'TaxID ya fue registrado. Intente con otro.', client: undefined });
                        // Validar formato correo facturacion
                        if( !validateEmail.validate(data.taxEmail) ) return res.status(200).send({ message: 'El formato del correo de facturación es inválido.', client: undefined });
                        // Registrar en facturapi para obtener su ID
                        const customer = await facturapi.customers.create({
                            legal_name: data.legalName,
                            tax_id: data.taxId,
                            tax_system: data.taxSystem,
                            email: data.taxEmail,
                            address: {
                                street: data.address.street,
                                exterior: data.address.exterior,
                                interior: data.address.interior,
                                neighborhood: data.address.neighborhood,
                                zip: data.address.zip
                            }
                        });
                        // Registar el objeto relacionandolo con el ID
                        let client = await Client.create({
                            facturapiId: customer.id,
                            legalName: customer.legal_name,
                            bussinessActivity: {
                                activity: data.bussinessActivity.activity,
                                description: data.bussinessActivity.description
                            },
                            taxId: customer.tax_id,
                            taxSystem: customer.tax_system,
                            taxEmail: customer.email,
                            cfdi: data.cfdi,
                            paymentForm: data.paymentForm,
                            paymentMethod: data.paymentMethod,
                            contact: data.contact,
                            address: {
                                street: customer.address.street,
                                exterior: customer.address.exterior,
                                interior: customer.address.interior,
                                neighborhood: customer.address.neighborhood,
                                city: customer.address.city,
                                municipality: customer.address.municipality,
                                state: customer.address.state,
                                country: customer.address.country,
                                zip: customer.address.zip,
                                streets: {
                                    a: data.address.streets.a,
                                    b: data.address.streets.b
                                }
                            },
                            type: data.type,
                            password: hash
                        });
                        return res.status(201).send({ message: 'Cliente creado correctamente.', client });
                            

                    } else if ( data.type === 'PROSPECT' && data.taxId === undefined && data.taxSystem === undefined && data.taxEmail === undefined && data.cfdi === undefined && data.paymentForm === undefined && data.paymentMethod === undefined ) {
                        // Registro del objeto en DB
                        let prospect = await Client.create(data);
                        return res.status(201).send({ message: 'Prospecto creado correctamente.', client: prospect });
                    } else {
                        return res.status(200).send({ message: 'No fue posible registrar al cliente/prospecto, verifique los campos solicitantes para cada caso.', client: undefined });
                    }  

                }

            });

        } catch (e) {
            res.status(400).send({message: 'Verifique los datos registrados.', client: undefined});
        }

    } else {
        res.status(403).send({message: 'No hay un token válido para esta petición.', client: undefined});
    }
}

const edit_client = async (req, res) => {
    if(req.user) {
        let id = req.params.id;
        let data = req.body;
        const getClientById = await Client.findById(id);

        try {

            bcrypt.hash('lagalm2023', null, null, async (err, hash) => {

                if(err) {
                    res.status(200).send({message: 'No se pudo generar la contraseña.', client: undefined});
                } else {
                    // Validar formato de correo
                    if (!validateEmail.validate(data.contact.email)) return res.status(200).send({ message: 'El formato del correo de contacto no es inválido.', client: undefined });
                    // Validar si el correo o nombre de la empresa existe
                    const someLegalName = await Client.find({ legalName: data.legalName });
                    const someEmail = await Client.find({ "contact.email": data.contact.email });
                    if( someLegalName.length >= 1 || someEmail.length >= 1 ) {
                        if( someLegalName.length >= 1 ) return res.status(200).send({ message: 'El nombre de la empresa ya fue registrado. Intente con otro.', client: undefined });
                        if( someEmail.length >= 1 ) return res.status(200).send({ message: 'El correo ya fue registrado. Intente con otro.', client: undefined });
                    }
                    // Si viene telefono
                    if( data.contact.phone ) {
                        // Validar formato de telefono
                        if ( !isValidPhone(52, data.contact.phone) ) return res.status(200).send({ message: 'El número telefonico es inválido.', client: undefined });
                    }

                    if(data.type === 'CLIENT' && data.taxId && data.taxSystem && data.taxEmail && data.address.zip ) {
                        // Validar formato RFC
                        if(!validateRfc(data.taxId).isValid) return res.status(200).send({ message: 'El RFC es inválido.', client: undefined });
                        const someTaxId = await Client.find({ taxId: data.taxId });
                        if( someTaxId.length >= 1 ) return res.status(200).send({ message: 'TaxID ya fue registrado. Intente con otro.', client: undefined });
                        // Validar formato correo facturacion
                        if(!validateEmail.validate(data.taxEmail)) return res.status(200).send({ message: 'El formato del correo de facturación es inválido.', client: undefined });
                        
                        if(getClientById.facturapiId) {
                            
                            var customer = await facturapi.customers.update(
                                getClientById.facturapiId,
                                {
                                    legal_name: data.legalName,
                                    tax_id: data.taxId,
                                    tax_system: data.taxSystem,
                                    email: data.taxEmail,
                                    address: {
                                        street: data.address.street,
                                        exterior: data.address.exterior,
                                        interior: data.address.interior,
                                        neighborhood: data.address.neighborhood,
                                        city: data.address.city,
                                        municipality: data.address.municipality,
                                        state: data.address.state,
                                        country: data.address.country,
                                        zip: data.address.zip
                                    }
                                }
                            );
                        } else {
                            var customer = await facturapi.customers.create({
                                legal_name: data.legalName,
                                tax_id: data.taxId,
                                tax_system: data.taxSystem,
                                email: data.taxEmail,
                                address: {
                                    street: data.address.street,
                                    exterior: data.address.exterior,
                                    interior: data.address.interior,
                                    neighborhood: data.address.neighborhood,
                                    zip: data.address.zip
                                }
                            });
                        }
                        let client = await Client.findByIdAndUpdate({ _id: id },{
                            facturapiId: customer.id,
                            legalName: customer.legal_name,
                            bussinessActivity: {
                                activity: data.bussinessActivity.activity,
                                description: data.bussinessActivity.description
                            },
                            taxId: customer.tax_id,
                            taxSystem: customer.tax_system,
                            taxEmail: customer.email,
                            contact: data.contact,
                            address: {
                                street: customer.address.street,
                                exterior: customer.address.exterior,
                                interior: customer.address.interior,
                                neighborhood: customer.address.neighborhood,
                                city: customer.address.city,
                                municipality: customer.address.municipality,
                                state: customer.address.state,
                                country: customer.address.country,
                                zip: customer.address.zip,
                                streets: {
                                    a: data.address.streets.a,
                                    b: data.address.streets.b
                                }
                            },
                            type: data.type,
                            password: hash
                        });
                        return res.status(200).send({ message: 'Cliente actualizado correctamente.', client });
                        
                    } else if (data.type === 'PROSPECT' && data.taxId === undefined && data.taxSystem === undefined && data.taxEmail === undefined) {
                        // Actualizacion del objeto en DB
                        let prospect = await Client.findByIdAndUpdate({ _id: id },data);
                        return res.status(201).send({ message: 'Prospecto actualizado correctamente.', client: prospect });
                    } else {
                        return res.status(200).send({ message: 'No fue posible actualizar al cliente/prospecto, verifique los campos solicitantes para cada caso.', client: undefined });
                    }
                }

            });

        } catch (e) {
            res.status(400).send({message: 'Verifique los datos registrados.', client: undefined});
        }
        
    } else {
        res.status(403).send({message: 'No hay un token válido para esta petición.', employee: undefined});
    }
}

const get_client = async (req, res) => {
    if (req.user) {
        let id = req.params.id;
        
        try {
            let client = await Client.findById({ _id: id });
            res.status(200).send({ client }); 
        } catch (error) {
            res.status(200).send({ message: 'El id del cliente no es válido.', client: undefined }); 
        }

    } else {
        res.status(403).send({message: 'No hay un token válido para esta petición.', client: undefined});
    }
}

const get_clients = async (req, res) => {
    if (req.user) {

        const itemsPerPage = 20;
        if(req.params.page) {
            var page = req.params.page;
        } else {
            var page = 1;
        }

        await Client.find().sort('createdAt').paginate(page, itemsPerPage, (err, clients, total) => {
            if(err) {
                res.status(500).send({ message: 'Error en la petición.', data: undefined });
            } else {
                if(!clients) {
                    res.status(404).send({ message: 'No hay clientes en la base de datos', data: undefined })
                } else {
                    res.status(200).send({
                        itemsPerPage,
                        total, 
                        pages: Math.ceil(total/itemsPerPage), 
                        data: clients 
                    });
                }
            }
        });
    } else {
        res.status(403).send({message: 'No hay un token válido para esta petición.', data: undefined});
    }
}

const get_clientsByFilter = async (req, res) => {
    if (req.user) {

        let filter = req.params.filter;

        const itemsPerPage = 20;
        if(req.params.page) {
            var page = req.params.page;
        } else {
            var page = 1;
        }

        await Client.find({ 
            $or: [
                { legalName: new RegExp(filter, 'i') },
                { taxId: new RegExp(filter, 'i') },
                { type: new RegExp(filter, 'i') },
                { "contact.email": new RegExp(filter, 'i') },
                { "bussinessActivity.activity": new RegExp(filter, 'i') }
            ]}).sort('createdAt').paginate(page, itemsPerPage, (err, clients, total) => {
            if(err) {
                res.status(500).send({ message: 'Error en la petición.' });
            } else {
                if(!clients) {
                    res.status(404).send({ message: 'No hay clientes en la base de datos', clients: undefined })
                } else {
                    res.status(200).send({
                        itemsPerPage,
                        total, 
                        pages: Math.ceil(total/itemsPerPage), 
                        clients 
                    });
                }
            }
        });
    } else {
        res.status(403).send({message: 'No hay un token válido para esta petición.', clients: undefined});
    }
}

const editStatusClient = async (req, res) => {
    if (req.user) {
        let id = req.params.id;
        let data = req.body;

        let newState;
        
        if(data.status) {
            newState = false;
        } else if(!data.status) {
            newState = true;
        }

        let client = await Client.findByIdAndUpdate({ _id: id }, {
            status: newState
        })

        res.status(200).send({ client });

    } else {
        res.status(403).send({message: 'No hay un token válido para esta petición.', client: undefined});
    }
}

module.exports = {
    register_client,
    edit_client,
    get_client,
    get_clients,
    get_clientsByFilter,
    editStatusClient
}