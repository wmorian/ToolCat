import { Router } from 'express';
const router = Router();

import axios from 'axios';
import * as cheerio from 'cheerio';

const getMetaData = async (url) => {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const metaTags = {
        title: $('head title').text(),
        description: $('meta[name=description]').attr('content'),
        ogTitle: $('meta[property="og:title"]').attr('content'),
        ogDescription: $('meta[property="og:description"]').attr('content'),
        ogImage: $('meta[property="og:image"]').attr('content'),
    };

    return metaTags;
};

router.post('/', async (req, res) => {
    const { url } = req.body;

    getMetaData(url)
        .then(tags => {
            res.json(tags)
        })
        .catch(console.error);
});

export default router;