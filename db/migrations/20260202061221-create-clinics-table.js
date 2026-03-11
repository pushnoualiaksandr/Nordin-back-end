'use strict';

module.exports = {
    up: async (queryInterface) => {
        const { DataTypes } = require('sequelize');
        await queryInterface.createTable('clinics', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            city: {
                type: DataTypes.STRING,
                allowNull: false
            },
            desc:{
                type: DataTypes.JSONB,
                allowNull: true,
            },
            socialNetwork:{
                type: DataTypes.STRING(512),
                allowNull: true,
            },
            clinicOperations:{
                type: DataTypes.STRING(512),
                allowNull: true,
            },
            street: {
                type: DataTypes.STRING,
                allowNull: false
            },
            phones: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                defaultValue: []
            },
            shortPhone: {
                type: DataTypes.STRING,
                allowNull: true
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
    },

    down: async (queryInterface) => {
        await queryInterface.dropTable('clinics');
    }
};