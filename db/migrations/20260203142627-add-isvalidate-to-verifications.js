'use strict';

module.exports = {
    async up(queryInterface) {
        const { DataTypes } = require('sequelize');


        await queryInterface.addColumn('verifications', 'isValidate', {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('verifications', 'isValidate');
    }
};