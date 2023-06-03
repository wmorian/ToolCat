const express = require('express');
const app = express();
const toolRoutes = require('./routes/toolRoutes');
const tagsRoutes = require('./routes/tagRoutes');
const categoriesRoutes = require('./routes/categoryRoutes');

app.use(express.json()); // for parsing application/json

// Serve static files from the public directory
app.use(express.static('public'));

// Initialize sequelize and setup relationships
const sequelize = require('./models/index');
const Tool = require('./models/tool');
const Category = require('./models/category');
const Tag = require('./models/tag');

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
