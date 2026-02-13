'use strict';

module.exports = {
    async up(queryInterface) {
        const { DataTypes } = require('sequelize');

        await queryInterface.addColumn('tokens', 'refreshTokenExpiresAt', {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
        });
    },

    async down(queryInterface) {
        await queryInterface.removeColumn('tokens', 'refreshTokenExpiresAt');
    }
};
