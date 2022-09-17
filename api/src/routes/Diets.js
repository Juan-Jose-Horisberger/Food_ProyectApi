const express = require('express');
const router = express();
const { getDiets } = require('../controllers/Diets.controller');



// GET

router.get('/', getDiets);

// POST


// PUT


// DELETE

module.exports = router;