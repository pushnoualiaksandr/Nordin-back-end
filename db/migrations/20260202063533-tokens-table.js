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
                allowNull: true
            },
            code: {
                type: DataTypes.STRING(512),
                allowNull: true,
                defaultValue: null,

            },
            cipher: {
                type: DataTypes.STRING(512),
                allowNull: true,
                defaultValue: null,

            },

            codePassHash:{
                type: DataTypes.STRING(512),
                allowNull: true,
                defaultValue: null,
            },
            publicKey: {
                type: DataTypes.STRING(512),
                allowNull: true,
                defaultValue: null,

            },
            deviceId: {
                type: DataTypes.TEXT,
                allowNull: true,
                defaultValue: null,

            },

            refreshTokenExpiresAt:{
                type: DataTypes.DATE,
                allowNull: true,
                defaultValue: null,
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