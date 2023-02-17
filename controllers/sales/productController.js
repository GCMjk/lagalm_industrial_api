const mongoosePaginate = require('mongoose-pagination');
const Product = require('../../models/sales/Product');
const Client = require('../../models/sales/Client');

const Facturapi = require('facturapi');
const facturapi = new Facturapi(process.env.FACTURAPI_KEY);

const register_product = async (req, res) => {
    if(req.user) {
        let data = req.body;

        try {

            var client = await Client.findById(data.client);
            
            if (client.status) {
                if(client.type === 'CLIENT' && data.productKey && data.price && data.taxability && data.unitKey && data.unitName && data.sku) {
                    const product = await facturapi.products.create({
                        description: data.description,
                        product_key: data.productKey,
                        price: data.price,
                        tax_included: data.taxIncluded,
                        taxability: data.taxability,
                        unit_key: data.unitKey,
                        unit_name: data.unitName,
                        sku: data.sku
                    });
                    let createProduct = await Product.create({
                        facturapiID: product.id,
                        description: product.description,
                        customerPart: data.customerPart,
                        productKey: product.product_key,
                        price: product.price,
                        taxIncluded: product.tax_included,
                        taxability: product.taxability,
                        unitKey: product.unit_key,
                        unitName: product.unit_name,
                        sku: product.sku,
                        assigned: data.assigned,
                        client: data.client
                    });
                    return res.status(201).send({ message: `Producto del cliente ${client.legalName}, creado correctamente`, data: createProduct });    
                } else if (client.type === 'PROSPECT' && data.productKey === undefined && data.taxIncluded === undefined && data.taxability === undefined && data.unitKey === undefined && data.unitName === undefined) {
                    // Registro del objeto en DB
                    let product = await Product.create(data);
                    return res.status(201).send({ message: `Producto del cliente ${client.legalName}, creado correctamente.`, data: product });
                } else {
                    return res.status(400).send({ message: 'No fue posible registrar al producto, verifique los campos solicitantes para cada caso' })
                }
            } else {
                return res.status(400).send({ message: 'El cliente esta inactivo, no es posible registar un producto' })
            }

        } catch(e) {
            res.status(500).send({ message: 'Error con la petición' });
        }

    } else {
        res.status(401).send({ message: 'No hay un token válido para esta petición' });
    }
}

const edit_product = async (req, res) => {
    if(req.user) {
        let id = req.params.id;
        let data = req.body;
        const getProductById = await Product.findById(id);

        try {

            var client = await Client.findById(data.client);
            
            if (client.status) {
                if(client.type === 'CLIENT' && data.productKey && data.price && data.taxability && data.unitKey && data.unitName && data.sku) {
                    if(getProductById.facturapiID) {
                        var product = await facturapi.products.update(
                            getProductById.facturapiID,
                            {
                                description: data.description,
                                product_key: data.productKey,
                                price: data.price,
                                tax_included: data.taxIncluded,
                                taxability: data.taxability,
                                unit_key: data.unitKey,
                                unit_name: data.unitName,
                                sku: data.sku
                            }
                        );
                    } else {
                        var product = await facturapi.products.create({
                            description: data.description,
                            product_key: data.productKey,
                            price: data.price,
                            tax_included: data.taxIncluded,
                            taxability: data.taxability,
                            unit_key: data.unitKey,
                            unit_name: data.unitName,
                            sku: data.sku
                        });
                    }
                    const createProduct = await Product.findByIdAndUpdate({ _id: id },{
                        facturapiId: product.id,
                        description: product.description,
                        customerPart: data.customerPart,
                        productKey: product.product_key,
                        price: product.price,
                        taxIncluded: product.tax_included,
                        taxability: product.taxability,
                        unitKey: product.unit_key,
                        unitName: product.unit_name,
                        sku: data.sku,
                        assigned: data.assigned,
                        client: data.client
                    });
                    return res.status(201).send({ message: `Producto del cliente ${client.legalName}, creado correctamente`, data: createProduct });    
                } else if (client.type === 'PROSPECT' && data.productKey === undefined && data.taxIncluded === undefined && data.taxability === undefined && data.unitKey === undefined && data.unitName === undefined) {
                    // Actualizar el objeto en DB
                    const product = await Product.findByIdAndUpdate({ _id: id }, data);
                    return res.status(201).send({ message: `Producto del cliente ${client.legalName}, actualizado correctamente`, data: product });
                } else {
                    return res.status(400).send({ message: 'No fue posible actualizar al producto, verifique los campos solicitantes para cada caso' })
                }
            } else {
                return res.status(400).send({ message: 'El cliente esta inactivo, no es posible actualizar un producto' })
            }

        } catch(err) {
            res.status(500).send({ message: 'Error con la petición' });
        }

    } else {
        res.status(401).send({ message: 'No hay un token válido para esta petición' });
    }
}

const get_product = async (req, res) => {
    if (req.user) {
        let id = req.params.id;
        
        try {
            const product = await Product.findById({ _id: id }).populate('client');
            res.status(200).send({ message: `${product.description} cargado correctamente`, data: product }); 
        } catch(err) {
            res.status(500).send({ message: 'Error con la petición' });
        }

    } else {
        res.status(401).send({ message: 'No hay un token válido para esta petición' });
    }
}

const get_products = async (req, res) => {
    if (req.user) {

        const itemsPerPage = 20;
        if(req.params.page) {
            var page = req.params.page;
        } else {
            var page = 1;
        }

        try {
            await Product.find().populate('client').sort('createdAt').paginate(page, itemsPerPage, (err, products, total) => {
                if(err) {
                    res.status(500).send({ message: 'Error en la petición' });
                } else {
                    if(products.length === 0) {
                        res.status(404).send({ message: 'No hay productos en la base de datos' })
                    } else {
                        res.status(200).send({
                            itemsPerPage,
                            total, 
                            pages: Math.ceil(total/itemsPerPage),
                            message: `${total} productos cargados correctamente`, 
                            data: products 
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

const get_productsByClient = async (req, res) => {
    if (req.user) {

        let id = req.params.id;
        const itemsPerPage = 20;
        if(req.params.page) {
            var page = req.params.page;
        } else {
            var page = 1;
        }

        try {
            await Product.find({ client: id }).sort('createdAt').paginate(page, itemsPerPage, (err, products, total) => {
                if(err) {
                    res.status(500).send({ message: 'Error en la petición.' });
                } else {
                    if(products.length === 0) {
                        res.status(404).send({ message: 'No hay productos del cliente en la base de datos', products: undefined })
                    } else {
                        res.status(200).send({
                            itemsPerPage,
                            total, 
                            pages: Math.ceil(total/itemsPerPage), 
                            products 
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

const editStatusProduct = async (req, res) => {
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

            const product = await Product.findByIdAndUpdate({ _id: id }, {
                status: newState
            })
            res.status(200).send({ message: `El producto ${product.description}, cambio de estado`, data: product });

        } catch (e) {
            res.status(500).send({ message: 'Error con la petición' });
        }

    } else {
        res.status(401).send({ message: 'No hay un token válido para esta petición' });
    }
}

module.exports = {
    register_product,
    edit_product,
    get_product,
    get_products,
    get_productsByClient,
    editStatusProduct
}