var express = require('express');
var joi = require('joi');
var ticketSchema = require('./validationSchemas/ticketSchema');
var ticketCtrl = require('../controllers/ticketController');
var expressJoi = require('express-joi-validator');
var router = express.Router();

router.post('/:name', expressJoi(ticketSchema.addTicket), ticketCtrl.addTicket);
router.get('/:name', ticketCtrl.getTicket);
router.delete('/:name', ticketCtrl.deleteTicket);
router.put('/:name', expressJoi(ticketSchema.addTicket), ticketCtrl.updateTicket);


module.exports = router;