var express = require('express');
var router = express.Router();
const indexController = require('../controllers/indexController');
const validateIndex = require('../middleware/validate')

//Product
router.get('/indexing', indexController.index);
router.delete('/kurs/:date', indexController.destroy);
router.get('/kurs', indexController.showByDate);
router.get('/kurs/:symbol', indexController.showBySymbolDate);
router.post('/kurs', validateIndex.validate('post'), indexController.create);
router.put('/kurs', validateIndex.validate('put'), indexController.update);

module.exports = router;
