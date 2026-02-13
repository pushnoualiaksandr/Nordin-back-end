'use strict';

module.exports = {
    up: async (queryInterface) => {
        const { DataTypes } = require('sequelize');

        await queryInterface.changeColumn('tokens', 'refreshToken', {
            type: DataTypes.TEXT,
            allowNull: true,
        });
    },

    down: async (queryInterface) => {
        const { DataTypes } = require('sequelize');

        await queryInterface.changeColumn('tokens', 'refreshToken', {
            type: DataTypes.TEXT,
            allowNull: false,
        });
    },
};

