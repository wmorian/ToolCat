import { Router } from 'express';
import { Op } from "sequelize";
import Category from '../models/category.js';
const router = Router();

router.get('/', async (req, res) => {
    const categories = await Category.findAll();
    res.json(categories);
});

// Endpoint to fetch categories based on a query
router.get('/search', async (req, res) => {
    const query = req.query.query;
    if (!query) {
        return res.status(400).json({ error: 'No query provided.' });
    }

    try {
        const categories = await Category.findAll({
            where: {
                name: {
                    [Op.like]: '%' + query + '%'
                }
            }
        });
        const result = categories.map(c => c.name);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while searching categories.' });
    }
});

export default router;