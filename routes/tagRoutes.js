const express = require('express');
const Tag = require('../models/tag')
const router = express.Router();

router.get('/', async (req, res) => {
    const tags = await Tag.findAll();
    res.json(tags);
});

module.exports = router;