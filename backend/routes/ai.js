const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/aiController');

router.post('/chat',           ctrl.chat);
router.post('/compare-summary', ctrl.compareSummary);
router.post('/price-insight',  ctrl.priceInsight);

module.exports = router;
