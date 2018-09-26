var express = require('express');
var fileSearchCtrl = require('../controllers/fileSearchController');
var router = express.Router();

/**
 * Used to search for a signature file that includes the given description
 */
router.get('/:description', fileSearchCtrl.getFile);

module.exports = router;