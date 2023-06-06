import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import express, { json, static as serve } from 'express';
const app = express();
import toolRoutes from './routes/toolRoutes.js';
import tagsRoutes from './routes/tagRoutes.js';
import categoriesRoutes from './routes/categoryRoutes.js';
import metaRoutes from './routes/metaRoutes.js';

app.use(json()); // for parsing application/json

// Serve static files from the public directory
app.use(serve('public'));

// Initialize sequelize and setup relationships
import sequelize from './models/index.js';
import Tool from './models/tool.js';
import Category from './models/category.js';
import Tag from './models/tag.js';

Tool.belongsToMany(Category, { through: 'ToolCategory' });
Category.belongsToMany(Tool, { through: 'ToolCategory' });

Tool.belongsToMany(Tag, { through: 'ToolTag' });
Tag.belongsToMany(Tool, { through: 'ToolTag' });

// Function to read JSON files
function loadJSON(fileName) {
    const filePath = path.join(__dirname, fileName);
    const jsonString = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(jsonString);
}

// Check if the SQLite database file exists, and if not, create and seed it
const dbFilePath = path.join(__dirname, 'database.sqlite');
if (!fs.existsSync(dbFilePath)) {
    sequelize.sync({ force: true }).then(async () => {
        console.log('Database & tables created!');

        // Now seed the database
        const categoriesData = loadJSON('seeds/categories.json');
        const tagsData = loadJSON('seeds/tags.json');

        await Category.bulkCreate(categoriesData);
        await Tag.bulkCreate(tagsData);
        console.log('Data seeded!');
    });
} else {
    // Sync all models
    sequelize.sync();
}

// Routes
app.use('/api/tools', toolRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/tags', tagsRoutes);
app.use('/api/meta', metaRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
