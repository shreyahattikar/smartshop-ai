const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/productsController');

router.get('/',              ctrl.getProducts);
router.get('/categories',    ctrl.getCategories);
router.get('/recommendations', ctrl.getRecommendations);
router.post('/compare',      ctrl.compareProducts);
router.get('/:id',           ctrl.getProductById);
router.get('/:id/price-history', ctrl.getPriceHistory);

module.exports = router;
