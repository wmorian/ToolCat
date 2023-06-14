import { DataTypes } from 'sequelize';
import sequelize from './index.js';

const Tool = sequelize.define('Tool', {
    name: { type: DataTypes.STRING, allowNull: false },
    link: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: true },
    creator: { type: DataTypes.STRING, allowNull: false },
    image: { type: DataTypes.STRING, allowNull: true },
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
});

export default Tool;
