const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/preferencesController');
router.get('/',  ctrl.getPreferences);
router.put('/',  ctrl.updatePreferences);
module.exports = router;
