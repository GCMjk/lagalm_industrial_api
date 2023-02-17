const mongoosePaginate = require('mongoose-pagination');
const Order = require('../../models/sales/Order');
const Client = require('../../models/sales/Client');
const Product = require('../../models/sales/Product');

const Facturapi = require('facturapi');
const facturapi = new Facturapi(process.env.FACTURAPI_KEY);

const register_order = async (req, res) => {
    if(req.user){
        let data = req.body;

        try {
            var {
                legalName,
                tax: {
                    facturapiID: customerID,
                    daysOfExpiration,
                    use,
                    paymentForm,
                    paymentMethod,
                    currency
                }
            } = await Client.findById(data.customer);
            var items = await Promise.all(
                data.items.map(async ({quantity, product: id}) => {
                    const { facturapiID: productID } = await Product.findById({ _id: id });
                    return {
                        quantity,
                        product: productID
                    }
                })
            );
            if(currency === 'USD') {
                var exchange = 19.02;
                const usdToMxn = await Promise.all(
                    data.items.map(async ({quantity, product: id}) => {
                        const { price } = await Product.findById({ _id: id });
                        const amount = price * quantity;
                        const ivaOfAmount = amount * .16;
                        const withIva = amount + ivaOfAmount;
                        return withIva * exchange;
                    })
                );
                var mxn = new Intl.NumberFormat('es-MX').format(usdToMxn.map(c => parseFloat(c)).reduce((a, b) => a + b, 0).toFixed(2));
            } 
            const invoice = await facturapi.invoices.create({
                customer: customerID,
                items,
                use,
                payment_form: paymentForm,
                payment_method: paymentMethod,
                currency,
                exchange: currency === 'USD' 
                    ? exchange 
                    : undefined,
                pdf_custom_section: currency === 'USD'
                    ? `<div> <span><b>Equivalente a: </b></span><span>$ ${mxn} MXN</span> </div>`
                    : undefined,
                conditions: `Días de vencimiento: ${daysOfExpiration}`
            });
            const order = await Order.create({
                invoiceID: invoice.id,
                ...data
            });
            return res.status(201).send({ message: `Orden del cliente ${legalName}, creada correctamente.`, data: order });

        } catch(e) {
            res.status(500).send({ message: 'Error con la petición' });
        }

    } else {
        res.status(401).send({ message: 'No hay un token válido para esta petición' });
    }
}

const edit_order = async (req, res) => {
    // TO DO: 
}

const get_order = async (req, res) => {
    if (req.user) {
        let id = req.params.id;
        
        try {
            const order = await Order.findById({ _id: id }).populate(['customer', 'items.product']);
            res.status(200).send({ message: `Orden del cliente ${order.customer.legalName} cargada correctamente`, data: order }); 
        } catch(err) {
            res.status(500).send({ message: 'Error con la petición' });
        }

    } else {
        res.status(401).send({ message: 'No hay un token válido para esta petición' });
    }
}

const get_orders = async (req, res) => {
    if (req.user) {

        const itemsPerPage = 20;
        if(req.params.page) {
            var page = req.params.page;
        } else {
            var page = 1;
        }

        try {
            await Order.find().sort('createdAt').populate(['customer', 'items.product']).paginate(page, itemsPerPage, (err, orders, total) => {
                if(err) {
                    res.status(500).send({ message: 'Error en la petición' });
                } else {
                    if(orders.length === 0) {
                        res.status(404).send({ message: 'No hay ordenes en la base de datos' })
                    } else {
                        res.status(200).send({
                            itemsPerPage,
                            total, 
                            pages: Math.ceil(total/itemsPerPage),
                            message: `${total} ordenes cargadas correctamente`,
                            data: orders 
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

const get_ordersByClient = async (req, res) => {
    if (req.user) {

        let client = req.params.client;
        const itemsPerPage = 20;
        if(req.params.page) {
            var page = req.params.page;
        } else {
            var page = 1;
        }

        try {
            await Order.find({ customer: client }).sort('createdAt').populate(['customer', 'items.product']).paginate(page, itemsPerPage, async (err, orders, total) => {
                if(err) {
                    res.status(500).send({ message: 'Error en la petición.' });
                } else {
                    const {
                        legalName
                    } = await Client.findById(client);

                    if(orders.length === 0) {
                        res.status(404).send({ message: `No hay ordenes del cliente ${legalName} en la base de datos` })
                    } else {
                        res.status(200).send({
                            itemsPerPage,
                            total, 
                            pages: Math.ceil(total/itemsPerPage),
                            message: `${legalName}, ${total} ordenes cargadas correctamente`,
                            data: orders 
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

const editStatusOrder = async (req, res) => {
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

            const order = await Order.findByIdAndUpdate({ _id: id }, {
                status: newState
            }).populate('customer');
            res.status(201).send({ message: `La orden del cliente ${order.customer.legalName}, cambio de estado`, data: order });

        } catch (e) {
            res.status(500).send({ message: 'Error con la petición' });
        }

    } else {
        res.status(401).send({ message: 'No hay un token válido para esta petición' });
    }
}

module.exports = {
    register_order,
    edit_order,
    get_order,
    get_orders,
    get_ordersByClient,
    editStatusOrder
}