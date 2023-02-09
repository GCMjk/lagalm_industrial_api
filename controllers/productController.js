const Product = require('../models/Product');
const Client = require('../models/Client');
const mongoosePaginate = require('mongoose-pagination');

const Facturapi = require('facturapi');
const facturapi = new Facturapi('sk_test_AP08J1rxzW9KYE64wvVram2bEOwna52eObVR3lXkdG');

const register_product = async (req, res) => {
    if(req.user) {
        let data = req.body;

        try {

            var someDescription = await Product.find({ description: data.description });
            var someCustomerPart = await Product.find({ customerPart: data.customerPart });
            var someSku = await Product.find({ sku: data.sku });
            if(someDescription.length >= 1 || someCustomerPart.length >= 1 || someSku.length >= 1) {
                if(someDescription.length >= 1) return res.status(200).send({ message: 'El producto ya fue registrado. Intente con otro.', product: undefined });;
                if(someCustomerPart.length >= 1) return res.status(200).send({ message: 'El numero de parte del cliente ya fue registrado. Intente con otro.', product: undefined });;
                if(someSku.length >= 1) return res.status(200).send({ message: 'El SKU ya fue registrado. Intente con otro.', product: undefined });;
            }

            var client = await Client.findById(data.client);
            
            if (client.status) {
                if(client.type === 'CLIENT' && data.productKey && !data.taxIncluded && data.taxability && data.unitKey && data.unitName) {
                    const product = await facturapi.products.create({
                        description: data.description,
                        product_key: data.productKey,
                        price: data.price.price,
                        tax_included: data.taxIncluded,
                        taxability: data.taxability,
                        unit_key: data.unitKey,
                        unit_name: data.unitName,
                        sku: data.sku
                    });
                    let createProduct = await Product.create({
                        facturapiId: product.id,
                        description: product.description,
                        customerPart: data.customerPart,
                        productKey: product.product_key,
                        price: {
                            currency: data.price.currency,
                            price: product.price
                        },
                        taxIncluded: product.tax_included,
                        taxability: product.taxability,
                        unitKey: product.unit_key,
                        unitName: product.unit_name,
                        sku: data.sku,
                        assigned: data.assigned,
                        client: data.client
                    });
                    return res.status(201).send({ message: `Producto del cliente ${client.legalName}, creado correctamente.`, product: createProduct });    
                } else if (client.type === 'PROSPECT' && data.productKey === undefined && data.taxIncluded === undefined && data.taxability === undefined && data.unitKey === undefined && data.unitName === undefined) {
                    // Registro del objeto en DB
                    let product = await Product.create(data);
                    return res.status(201).send({ message: `Producto del cliente ${client.legalName}, creado correctamente.`, product });
                } else {
                    return res.status(200).send({ message: 'No fue posible registrar al producto, verifique los campos solicitantes para cada caso.', product: undefined })
                }
            } else {
                return res.status(200).send({ message: 'El cliente esta inactivo, no es posible registar un producto.', product: undefined })
            }

        } catch (e) {
            res.status(400).send({message: 'Verifique los datos registrados.', product: undefined});
        }
    } else {
        res.status(403).send({message: 'No hay un token válido para esta petición.', product: undefined});
    }
}

const edit_product = async (req, res) => {
    if(req.user) {
        let id = req.params.id;
        let data = req.body;
        const getProductById = await Product.findById(id);

        try {

            var someDescription = await Product.find({ description: data.description });
            var someCustomerPart = await Product.find({ customerPart: data.customerPart });
            var someSku = await Product.find({ sku: data.sku });
            if(someDescription.length >= 1 || someCustomerPart.length >= 1 || someSku.length >= 1) {
                if(someDescription.length >= 1) return res.status(200).send({ message: 'El producto ya fue registrado. Intente con otro.', product: undefined });;
                if(someCustomerPart.length >= 1) return res.status(200).send({ message: 'El numero de parte del cliente ya fue registrado. Intente con otro.', product: undefined });;
                if(someSku.length >= 1) return res.status(200).send({ message: 'El SKU ya fue registrado. Intente con otro.', product: undefined });;
            }

            var client = await Client.findById(data.client);
            
            if (client.status) {
                if(client.type === 'CLIENT' && data.productKey && !data.taxIncluded && data.taxability && data.unitKey && data.unitName) {
                    if(getProductById.facturapiId) {
                        var product = await facturapi.products.update(
                            getProductById.facturapiId,
                            {
                                description: data.description,
                                product_key: data.productKey,
                                price: data.price.price,
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
                            price: data.price.price,
                            tax_included: data.taxIncluded,
                            taxability: data.taxability,
                            unit_key: data.unitKey,
                            unit_name: data.unitName,
                            sku: data.sku
                        });
                    }
                    let createProduct = await Product.findByIdAndUpdate({ _id: id },{
                        facturapiId: product.id,
                        description: product.description,
                        customerPart: data.customerPart,
                        productKey: product.product_key,
                        price: {
                            currency: data.price.currency,
                            price: product.price
                        },
                        taxIncluded: product.tax_included,
                        taxability: product.taxability,
                        unitKey: product.unit_key,
                        unitName: product.unit_name,
                        sku: data.sku,
                        assigned: data.assigned,
                        client: data.client
                    });
                    return res.status(201).send({ message: `Producto del cliente ${client.legalName}, creado correctamente.`, product: createProduct });    
                } else if (client.type === 'PROSPECT' && data.productKey === undefined && data.taxIncluded === undefined && data.taxability === undefined && data.unitKey === undefined && data.unitName === undefined) {
                    // Actualizar el objeto en DB
                    let product = await Product.findByIdAndUpdate({ _id: id }, data);
                    return res.status(201).send({ message: `Producto del cliente ${client.legalName}, actualizado correctamente.`, product });
                } else {
                    return res.status(200).send({ message: 'No fue posible actualizar al producto, verifique los campos solicitantes para cada caso.', product: undefined })
                }
            } else {
                return res.status(200).send({ message: 'El cliente esta inactivo, no es posible actualizar un producto.', product: undefined })
            }

        } catch (e) {
            res.status(400).send({message: 'Verifique los datos registrados.', product: undefined});
        }
    } else {
        res.status(403).send({message: 'No hay un token válido para esta petición.', product: undefined});
    }
}

const get_product = async (req, res) => {
    if (req.user) {
        let id = req.params.id;
        
        try {
            let product = await Product.findById({ _id: id });
            res.status(200).send({ product }); 
        } catch (error) {
            res.status(200).send({ message: 'El id del producto no es válido.', product: undefined }); 
        }

    } else {
        res.status(403).send({message: 'No hay un token válido para esta petición.', product: undefined});
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

        await Product.find().sort('createdAt').paginate(page, itemsPerPage, (err, products, total) => {
            if(err) {
                res.status(500).send({ message: 'Error en la petición.', data: undefined });
            } else {
                if(!products) {
                    res.status(404).send({ message: 'No hay productos en la base de datos', data: undefined })
                } else {
                    res.status(200).send({
                        itemsPerPage,
                        total, 
                        pages: Math.ceil(total/itemsPerPage), 
                        data: products 
                    });
                }
            }
        });
    } else {
        res.status(403).send({message: 'No hay un token válido para esta petición.', data: undefined});
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

        await Product.find({ client: id }).sort('createdAt').paginate(page, itemsPerPage, (err, products, total) => {
            if(err) {
                res.status(500).send({ message: 'Error en la petición.' });
            } else {
                if(!products) {
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
    } else {
        res.status(403).send({message: 'No hay un token válido para esta petición.', clients: undefined});
    }
}

const editStatusProduct = async (req, res) => {
    if (req.user) {
        let id = req.params.id;
        let data = req.body;

        let newState;
        
        if(data.status) {
            newState = false;
        } else if(!data.status) {
            newState = true;
        }

        let product = await Product.findByIdAndUpdate({ _id: id }, {
            status: newState
        })

        res.status(200).send({ product });

    } else {
        res.status(403).send({message: 'No hay un token válido para esta petición.', product: undefined});
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