'use strict';

module.exports = {
    async up(queryInterface) {
        const { DataTypes } = require('sequelize');
        await queryInterface.createTable('verifications', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            authField: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            code: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            lastRequestTime: {
                type: DataTypes.BIGINT,
                allowNull: false,
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue:DataTypes.NOW,
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        });


        await queryInterface.addIndex('verifications', ['authField'], {
            name: 'verifications_auth_field_idx',
        });
    },

    async down(queryInterface, Sequelize) {

        await queryInterface.removeIndex('verifications', 'verifications_auth_field_idx');


        await queryInterface.dropTable('verifications');
    }
};
