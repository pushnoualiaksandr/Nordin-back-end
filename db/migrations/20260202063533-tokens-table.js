'use strict';

module.exports = {
    up: async (queryInterface) => {
        const { DataTypes } = require('sequelize');

        await queryInterface.createTable('tokens', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            refreshToken: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            code: {
                type: DataTypes.STRING,

            },
            fcmTokens: {
                type: DataTypes.ARRAY(DataTypes.TEXT),

            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onDelete: 'CASCADE'
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            }
        });


        await queryInterface.addIndex('tokens', ['refreshToken'], {
            name: 'tokens_refresh_token_idx'
        });

        await queryInterface.addIndex('tokens', ['userId'], {
            name: 'tokens_user_id_idx'
        });

    },
    down: async (queryInterface) => {

        await queryInterface.removeIndex('tokens', 'tokens_user_id_idx');
        await queryInterface.removeIndex('tokens', 'tokens_refresh_token_idx');
        await queryInterface.dropTable('tokens');
    }
};