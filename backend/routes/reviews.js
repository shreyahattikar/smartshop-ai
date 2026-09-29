const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/reviewsController');

router.get('/',         ctrl.getReviews);
router.post('/analyze', ctrl.analyzeReviews);

module.exports = router;
