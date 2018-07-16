var joi = require('joi');

module.exports = {
    addTicket: {
        params: {
            name: joi.string().required()
        },
        body: {
            description: joi.string().required(),
            ticketNumber: joi.string().required(),
            ticketUrl: joi.string().required()
        }
    }
};