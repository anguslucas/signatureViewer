var express = require('express');
var Promise = require('bluebird');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('../node_modules/body-parser');

//mongoose
require('./models/ticketModel.js')

var ticketRoutes = require('./routes/ticketRoutes');

//middlewares
app.use(bodyParser.json());
//routes
app.use('/ticket', ticketRoutes);

mongoose.Promise = Promise;
var db = mongoose.connection;
db.on('connecting', function() {
    console.log('connecting to MongoDB...');
});
db.on('error', function(error) {
    console.error('Error in MongoDb connection: ' + error);
mongoose.disconnect();
});
db.on('connected', function() {
    console.log('MongoDB connected!');
});
db.once('open', function() {
    console.log('MongoDB connection opened!');
});
db.on('reconnected', function () {
    console.log('MongoDB reconnected!');
});
db.on('disconnected', function() {
    console.log('MongoDB disconnected!');
    mongoose.connect('mongodb://127.0.0.1/documentServer', {server:{auto_reconnect:true}});
});

mongoose.connect('mongodb://127.0.0.1/documentServer', {server:{auto_reconnect:true}});

//error handler 
app.use(function (err, req, res, next) {
    if (err.isBoom) {
         return res.status(err.output.statusCode).json(err.output.payload);
    }
});


var server = app.listen(8080, function(){
    var host = server.address().address;
    var port = server.address().port;

    console.log("example app listening at http://%s:%s", host, port)
})