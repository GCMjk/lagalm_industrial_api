const bcrypt = require("bcryptjs");
const mongoosePaginate = require('mongoose-pagination');
const Client = require('../../models/sales/Client');

const Facturapi = require('facturapi');
const facturapi = new Facturapi(process.env.FACTURAPI_KEY);

const register_client = async (req, res) => {
    if(req.user) {
        let data = req.body;

        try {

            if( data.type === 'CLIENT' && data.tax && data.address.zip ) {
                data.password = bcrypt.hashSync('lagalm2023', 10);
                const customer = await facturapi.customers.create({
                    legal_name: data.legalName,
                    tax_id: data.tax.taxID,
                    tax_system: data.tax.taxSystem,
                    email: data.tax.taxEmail,
                    address: {
                        street: data.address.street,
                        exterior: data.address.exterior,
                        interior: data.address.interior,
                        neighborhood: data.address.neighborhood,
                        zip: data.address.zip
                    }
                });
                const client = await Client.create({
                    legalName: customer.legal_name,
                    bussinessActivity: {
                        activity: data.bussinessActivity.activity,
                        description: data.bussinessActivity.description
                    },
                    tax: {
                        facturapiID: customer.id,
                        taxID: customer.tax_id,
                        taxSystem: customer.tax_system,
                        taxEmail: customer.email,
                        daysOfExpiration: data.tax.daysOfExpiration,
                        use: data.tax.use,
                        paymentForm: data.tax.paymentForm,
                        paymentMethod: data.tax.paymentMethod,
                        currency: data.tax.currency,
                        taxIncluded: data.tax.taxIncluded,
                        proofOfTaxSitutaion: data.tax.proofOfTaxSitutaion
                    },
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
                    type: data.type
                });
                return res.status(201).send({ message: 'Cliente creado correctamente', data: client });

            } else if ( data.type === 'PROSPECT' && data.tax === undefined ) {
                const prospect = await Client.create(data);
                return res.status(201).send({ message: 'Prospecto creado correctamente', data: prospect });
            } else {
                return res.status(400).send({ message: 'No fue posible registrar al cliente/prospecto, verifique los campos solicitantes para cada caso' });
            }

        } catch(e) {
            res.status(500).send({ message: 'Error con la petición' });
        }

    } else {
        res.status(401).send({ message: 'No hay un token válido para esta petición' });
    }
}

const edit_client = async (req, res) => {
    if(req.user) {
        let id = req.params.id;
        let data = req.body;
        const getClientById = await Client.findById(id);

        try {

            if( data.type === 'CLIENT' && data.tax && data.address.zip ) {
                
                const hash = bcrypt.hashSync(data.password, 10);
                
                if(getClientById.tax.facturapiID) {
                    
                    var customer = await facturapi.customers.update(
                        getClientById.tax.facturapiID,
                        {
                            legal_name: data.legalName,
                            tax_id: data.tax.taxID,
                            tax_system: data.tax.taxSystem,
                            email: data.tax.taxEmail,
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
                        tax_id: data.tax.taxID,
                        tax_system: data.tax.taxSystem,
                        email: data.tax.taxEmail,
                        address: {
                            street: data.address.street,
                            exterior: data.address.exterior,
                            interior: data.address.interior,
                            neighborhood: data.address.neighborhood,
                            zip: data.address.zip
                        }
                    });
                }
                const client = await Client.findByIdAndUpdate(
                    { _id: id },
                    {
                        legalName: customer.legal_name,
                        bussinessActivity: {
                            activity: data.bussinessActivity.activity,
                            description: data.bussinessActivity.description
                        },
                        tax: {
                            facturapiID: customer.id,
                            taxID: customer.tax_id,
                            taxSystem: customer.tax_system,
                            taxEmail: customer.email,
                            daysOfExpiration: data.tax.daysOfExpiration,
                            use: data.tax.use,
                            paymentForm: data.tax.paymentForm,
                            paymentMethod: data.tax.paymentMethod,
                            currency: data.tax.currency,
                            taxIncluded: data.tax.taxIncluded,
                            proofOfTaxSitutaion: data.tax.proofOfTaxSitutaion
                        },
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
                    },
                    { runValidators: true }
                );
                return res.status(201).send({ message: 'Cliente actualizado correctamente', data: client });
                
            } else if (data.type === 'PROSPECT' && data.tax === undefined) {
                const prospect = await Client.findByIdAndUpdate(
                    { _id: id },
                    data
                );
                return res.status(201).send({ message: 'Prospecto actualizado correctamente', data: prospect });
            } else {
                return res.status(400).send({ message: 'No fue posible actualizar al cliente/prospecto, verifique los campos solicitantes para cada caso' });
            }

        } catch(err) {
            res.status(500).send({ message: 'Error con la petición' });
        }
        
    } else {
        res.status(401).send({ message: 'No hay un token válido para esta petición' });
    }
}

const get_client = async (req, res) => {
    if (req.user) {
        let id = req.params.id;
        
        try {
            const client = await Client.findById({ _id: id });
            res.status(200).send({ message: `${client.legalName} cargado correctamente`, data: client }); 
        } catch(err) {
            res.status(500).send({ message: 'Error con la petición' });
        }

    } else {
        res.status(401).send({ message: 'No hay un token válido para esta petición' });
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

        try {
            await Client.find().sort('createdAt').paginate(page, itemsPerPage, (err, clients, total) => {
                if(err) {
                    res.status(500).send({ message: 'Error en la petición' });
                } else {
                    if(!clients) {
                        res.status(404).send({ message: 'No hay clientes en la base de datos' })
                    } else {
                        res.status(200).send({
                            itemsPerPage,
                            total, 
                            pages: Math.ceil(total/itemsPerPage),
                            message: `${total} clientes cargados correctamente`,
                            data: clients 
                        });
                    }
                }
            });
        } catch(err) {
            res.status(500).send({ message: 'Error con la petición' });
        }

    } else {
        res.status(401).send({ message: 'No hay un token válido para esta petición' });
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

        try {
            await Client.find({ 
                $or: [
                    { legalName: new RegExp(filter, 'i') },
                    { "tax.taxID": new RegExp(filter, 'i') },
                    { type: new RegExp(filter, 'i') },
                    { "contact.email": new RegExp(filter, 'i') },
                    { "bussinessActivity.activity": new RegExp(filter, 'i') }
                ]}).sort('createdAt').paginate(page, itemsPerPage, (err, clients, total) => {
                    if(err) {
                        res.status(500).send({ message: 'Error en la petición.' });
                    } else {
                        if(!clients) {
                            res.status(404).send({ message: 'No hay clientes en la base de datos' })
                        } else {
                            res.status(200).send({
                                itemsPerPage,
                                total, 
                                pages: Math.ceil(total/itemsPerPage),
                                message: `${filter}, ${total} clientes cargados correctamente`,
                                data: clients 
                            });
                        }
                    }
            });
        } catch(err) {
            res.status(500).send({ message: 'Error con la petición' });
        }
        
    } else {
        res.status(403).send({message: 'No hay un token válido para esta petición' });
    }
}

const editStatusClient = async (req, res) => {
    if (req.user) {
        let id = req.params.id;
        let data = req.body;

        try {
            let newState;
            if(data.status) {
                newState = false;
            } else if(!data.status) {
                newState = true;
            }

            const client = await Client.findByIdAndUpdate({ _id: id }, {
                status: newState
            });
            res.status(201).send({ message: `El cliente ${client.legalName}, cambio de estado`, data: client });

        } catch (e) {
            res.status(500).send({ message: 'Error con la petición' });
        }

    } else {
        res.status(401).send({ message: 'No hay un token válido para esta petición' });
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