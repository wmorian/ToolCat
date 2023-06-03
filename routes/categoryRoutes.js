const express = require('express');
const Category = require('../models/category')
const router = express.Router();

router.get('/', async (req, res) => {
    const categories = await Category.findAll();
    res.json(categories);
});

module.exports = router;