import { Router } from 'express';
const router = Router();

import axios from 'axios';
import * as cheerio from 'cheerio';
import url from 'url';

const getMetaData = async (url) => {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const metaTags = {
            title: $('head title').text(),
            description: $('meta[name=description]').attr('content'),
            ogTitle: $('meta[property="og:title"]').attr('content'),
            ogDescription: $('meta[property="og:description"]').attr('content'),
            ogImage: $('meta[property="og:image"]').attr('content'),
        };

        // Check if ogImage is not present
        if (!metaTags.ogImage) {
            const favicon = $('link[rel="icon"]').attr('href');
            if (favicon) {
                const absoluteUrl = url.resolve(url, favicon);
                metaTags.ogImage = absoluteUrl;
            }
        }

        return metaTags;
    } catch (error) {
        return [];
    }
};

router.post('/', async (req, res) => {
    const { url } = req.body;

    getMetaData(url)
        .then(metaTags => {
            res.json(metaTags)
        })
        .catch(console.error);
});

export default router;
