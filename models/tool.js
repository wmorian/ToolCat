const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./index');

const Tool = sequelize.define('Tool', {
    name: { type: DataTypes.STRING, allowNull: false },
    link: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: true },
    creator: { type: DataTypes.STRING, allowNull: false },
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
});

module.exports = Tool;
