import { Router } from 'express';
import Tag from '../models/tag.js';
const router = Router();

router.get('/', async (req, res) => {
    const tags = await Tag.findAll();
    res.json(tags);
});

export default router;