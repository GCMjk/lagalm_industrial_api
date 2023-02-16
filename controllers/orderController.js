const Order = require('../models/Order');
const Client = require('../models/sales/Client');
const Product = require('../models/sales/Product');
const mongoosePaginate = require('mongoose-pagination');

const Facturapi = require('facturapi');
const facturapi = new Facturapi('sk_test_AP08J1rxzW9KYE64wvVram2bEOwna52eObVR3lXkdG');

const register_order = async (req, res) => {
    if(req.user){
        let data = req.body;

        try {
            var { facturapiId, cfdi, paymentForm, paymentMethod, expiration } = await Client.findById(data.client);
            var items = await Promise.all(
                data.items.map(async ({quantity, product: id}) => {
                    const { facturapiId } = await Product.findById({ _id: id });
                    return {
                        quantity,
                        product: facturapiId
                    }
                })
            );

            const exchange = 19.02;
            const usdToMxn = await Promise.all(
                data.items.map(async ({quantity, product: id}) => {
                    const { price } = await Product.findById({ _id: id });
                    const amount = price.price * quantity;
                    const ivaOfAmount = amount * .16;
                    const withIva = amount + ivaOfAmount;
                    return withIva * exchange;
                })
            );
            const mxn = new Intl.NumberFormat('es-MX').format(usdToMxn.map(c => parseFloat(c)).reduce((a, b) => a + b, 0).toFixed(2));
            const invoice = await facturapi.invoices.create({
                customer: facturapiId,
                items,
                use: cfdi,
                payment_form: paymentForm,
                payment_method: paymentMethod,
                currency: "USD",
                exchange,
                pdf_custom_section: `<div> <span><b>Equivalente a: </b></span><span>$ ${mxn} MXN</span> </div>`,
                conditions: `Días de vencimiento: ${expiration}`
            });
            /* var client = await Client.findById(data.client);
            var product = await Product.findById(data.items.product);

            const orderFacturapi = await facturapi.invoices.create({
                customer: client.facturapiId,
                items: data.items,
                use: client.cfdi,
                payment_form: client.paymentForm,
                payment_method: client.paymentMethod,
                conditions: data.conditions
            });
            let order = await Order.create(data);
            return res.status(201).send({ message: `Orden del cliente ${client.legalName}, creada correctamente.`, order });
             */
        } catch (e) {
            res.status(400).send({message: 'Verifique los datos registrados.', order: undefined});
        }

    } else {
        res.status(403).send({message: 'No hay un token válido para esta petición.', order: undefined});
    }
}

module.exports = {
    register_order
}