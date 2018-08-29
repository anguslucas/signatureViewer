var express = require('express');
var fileSearchCtrl = require('../controllers/fileSearchController');
var router = express.Router();

router.get('/:description', fileSearchCtrl.getFile);

module.exports = router;