require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const chalk = require('chalk');

const port = process.env.PORT || 4201;

const app = express();

const test_routes = require('./routes/test');
const employee_routes = require('./routes/employee');

mongoose.set('strictQuery', false);
mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Connected to DB');
    })
    .catch((err) => {
        console.log(err.message);
    });

app.listen(port, () => {
    console.log('Serve at', chalk.green(`http://localhost:${port}`));
});

const config = {
    limit: '50mb',
    extended: true
}

app.use(bodyparser.urlencoded(config));
app.use(bodyparser.json(config));

// CORS
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*'); 
    res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods','GET, PUT, POST, DELETE, OPTIONS');
    res.header('Allow','GET, PUT, POST, DELETE, OPTIONS');
    next();
});

app.use('/api', test_routes);
app.use('/api', employee_routes);

module.exports = app;