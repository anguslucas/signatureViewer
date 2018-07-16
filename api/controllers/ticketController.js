var promise = require('bluebird')
var mongoose = require('mongoose')
var Ticket = mongoose.model('Tickets')

module.exports = {
    /**
     * add a ticket to the database
     * @req req.params.name the ticket name
     * @req req.body.description the ticket description
     * @req req.body.ticketNumber the ticket number
     * @req req.body.ticketUrl the Url for the ticket
     */
    addTicket: function (req, res, next){
        let {description, ticketNumber, ticketUrl} = req.body;
        let name = req.params.name;

        return Ticket.findOne({name: name})
            .then((result) => {
                if(result) {
                    res.status(400).send({ error: 'That name has already been used'});
                } else {
                    var ticket = new Ticket({
                        name: name,
                        description: description,
                        number: ticketNumber,
                        url: ticketUrl
                    })
                    return ticket.save();
                }
            })
            .then(result => res.json(result))
            .catch(next);
    },

    /**
     * get a ticket
     * @req req.params.name the ticket name
     */
    getTicket: function (req, res, next){
        let name = req.params.name;

        return Ticket.findOne({ name: name })
            .then((result) => {
                if(result){
                    res.json(result)
                } else {
                    res.status(400).send({ error: 'This ticket does not exist'});
                }
            })
            .catch(next);
    },

    /**
     * delete a ticket
     * @req req.params.name the ticket name
     */
    deleteTicket: function (req, res, next){
        let name = req.params.name;

        return Ticket.findOneAndRemove({name})
            .then((result) => {
                if(result){
                    res.json(result);
                } else {
                    res.status(400).send({error: 'This ticket does not exist'});
                }
            });
    },

    /**
     * update the ticket
     * @req req.params.name the ticket name
     * @req req.body.description the ticket description
     * @req req.body.ticketNumber the ticket number
     * @req req.body.ticketUrl the Url for the ticket
     */
    updateTicket: function (req, res, next){
        let {description, ticketNumber, ticketUrl} = req.body;
        let name = req.params.name;

        return Ticket.findOne({name: name})
            .then((result) => {
                if(result) {
                    result.description = description;
                    result.number = ticketNumber;
                    result.url = ticketUrl;
                    return result.save();
                } else {
                    res.status(400).send({error: 'This ticket does not exist'});
                }
            })
            .then(result => res.json(result))
            .catch(next);
    }
};