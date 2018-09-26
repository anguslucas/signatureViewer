const express = require('express'),
    app = express(),
    bodyParser = require('../node_modules/body-parser'),
    fileSearchRoutes = require('./routes/fileSearchRoutes'),
    config = require('../config.json');

//middlewares
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.use(bodyParser.json());
//routes
app.use('/search', fileSearchRoutes);
//error handler 
app.use(function (err, req, res, next) {
    if (err.isBoom) {
         return res.status(err.output.statusCode).json(err.output.payload);
    }
});

var server = app.listen(config.api.port, function(){
    const host = server.address().address,
        port = server.address().port;
    console.log("Signature Viewer API listening at http://%s:%s", host, port)
})