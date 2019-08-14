const express = require('express');
const priceController = require('./controllers/priceController');

const routes = express.Router()

// GET, POST, PUT, DELET
routes.get('/', (req, res) => {
    return res.json({ mensagem: `Olá ${req.query.name}` })
});

routes.get('/price', priceController.index);

module.exports = routes