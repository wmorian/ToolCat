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

// Sync all models
sequelize.sync();

// Routes
app.use('/api/tools', toolRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/tags', tagsRoutes);
app.use('/api/meta', metaRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
