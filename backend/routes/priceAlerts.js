const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/priceAlertsController');

router.get('/',    ctrl.getPriceAlerts);
router.post('/',   ctrl.createPriceAlert);
router.delete('/:id', ctrl.deletePriceAlert);

module.exports = router;
