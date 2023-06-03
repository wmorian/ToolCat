const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./index');

const Tag = sequelize.define('Tag', {
    name: { type: DataTypes.STRING, allowNull: false },
});

module.exports = Tag;
