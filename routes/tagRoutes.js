import { Router } from 'express';
import { Op } from "sequelize";
import Tag from '../models/tag.js';
const router = Router();

router.get('/', async (req, res) => {
    const tags = await Tag.findAll();
    res.json(tags);
});

// Endpoint to fetch categories based on a query
router.get('/search', async (req, res) => {
    const query = req.query.query;
    if (!query) {
        return res.status(400).json({ error: 'No query provided.' });
    }

    try {
        const tags = await Tag.findAll({
            where: {
                name: {
                    [Op.like]: '%' + query + '%'
                }
            }
        });
        const result = tags.map(c => c.name);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while searching categories.' });
    }
});

export default router;