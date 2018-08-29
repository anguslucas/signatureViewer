var express = require('express');
var Promise = require('bluebird');
var app = express();
var bodyParser = require('../node_modules/body-parser');
var fileSearchRoutes = require('./routes/fileSearchRoutes');

//middlewares
app.use(bodyParser.json());
//routes
app.use('/search', fileSearchRoutes);
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