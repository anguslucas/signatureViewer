var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TicketSchema = new Schema({
    name : {type: String, unique: true, required: true},
    description : {type: String, required: true},
    number: {type: String, required: true},
    url: {type: String}   
    }
);

TicketSchema.statics = {
    /**
     * Add ticket
     */
    // addTicket: function (name, description, number, url) {
    //     console.log('test')
    //     return this.insert({name, description, number, url})
    // }
}

module.exports = mongoose.model("Tickets", TicketSchema);