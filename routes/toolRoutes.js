const express = require('express');
const { Op } = require("sequelize");
const Tool = require('../models/tool');
const Category = require('../models/category')
const Tag = require('../models/tag')
const router = express.Router();

router.get('/', async (req, res) => {
    const tools = await Tool.findAll();
    res.json(tools);
});

router.post('/', async (req, res) => {
    const { categories, tags, ...toolData } = req.body;

    console.log(toolData)

    const [tool] = await Tool.findOrCreate({ where: { name: toolData.name }, defaults: toolData });

    if (categories) {
        for (const categoryData of categories) {
            const [category] = await Category.findOrCreate({ where: { name: categoryData.name }, defaults: categoryData });
            await tool.addCategory(category);
        }
    }

    if (tags) {
        for (const tagData of tags) {
            const [tag] = await Tag.findOrCreate({ where: { name: tagData.name }, defaults: tagData });
            await tool.addTag(tag);
        }
    }

    res.json(tool);
});

router.get('/search', async (req, res) => {
    const { query } = req.query;

    const tools = await Tool.findAll({
        where: {
            [Op.or]: [
                { name: { [Op.like]: `%${query}%` } },
                { description: { [Op.like]: `%${query}%` } },
                { '$Categories.name$': { [Op.like]: `%${query}%` } },
                { '$Tags.name$': { [Op.like]: `%${query}%` } }
            ]
        },
        include: [Category, Tag]
    });
    res.json(tools);
});

router.get('/:id([0-9]+)', async (req, res) => {
    const tool = await Tool.findByPk(req.params.id);
    res.json(tool);
});

router.put('/:id', async (req, res) => {
    await Tool.update(req.body, {
        where: { id: req.params.id }
    });
    res.json({ success: true });
});

router.delete('/:id', async (req, res) => {
    await Tool.destroy({
        where: { id: req.params.id }
    });
    res.json({ success: true });
});


module.exports = router;
