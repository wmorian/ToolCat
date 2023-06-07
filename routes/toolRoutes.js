import { Router } from 'express';
import { Op } from "sequelize";
import Tool from '../models/tool.js';
import Category from '../models/category.js';
import Tag from '../models/tag.js';
import Fuse from 'fuse.js'

const router = Router();

router.get('/', async (req, res) => {
    const tools = await Tool.findAll({ include: [Category, Tag] });
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

    try {
        const tools = await Tool.findAll({
            attributes: ['name', 'description', 'link', 'creator', 'created_at'], // Only fetch these attributes
            include: [
                {
                    model: Category,
                    attributes: ['name'], // Only fetch the 'name' attribute
                    through: { attributes: [] } // Do not fetch the junction table attributes
                },
                {
                    model: Tag,
                    attributes: ['name'], // Only fetch the 'name' attribute
                    through: { attributes: [] } // Do not fetch the junction table attributes
                },
            ]
        });

        // Map through the results and convert categories and tags into a list of strings
        const formattedTools = tools.map(tool => {
            const categories = tool.Categories.map(category => category.name);
            const tags = tool.Tags.map(tag => tag.name);

            return {
                "name": tool.name,
                "description": tool.description,
                "link": tool.link,
                categories, // Override the categories with the list of category names
                tags, // Override the tags with the list of tag names
            };
        });

        const options = {
            includeScore: true,
            keys: ['name', 'description', 'categories', 'tags']
        };

        if (!query) {
            res.json(formattedTools);
        } else {
            const fuse = new Fuse(formattedTools, options);
            const result = fuse.search(query);
            const matches = result
                .filter(r => r.score < 0.6) // score=0 is best match and score=1 is worst
                .map(r => (
                    {
                        "name": r.item.name,
                        "description": r.item.description,
                        "link": r.item.link,
                        "categories": r.item.categories, // Override the categories with the list of category names
                        "tags": r.itemtags, // Override the tags with the list of tag names
                    }
                ))
            res.json(matches);
        }
    } catch (err) {
        res.json({ message: err });
    }
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


export default router;
