'use strict';

module.exports = {
    up: async (queryInterface) => {
        const { DataTypes } = require('sequelize');
        await queryInterface.createTable('clinic_users', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
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
            clinicId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'clinics', key: 'id' },
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


        await queryInterface.addIndex('clinic_users', ['userId', 'clinicId'], {
            unique: true,
            name: 'clinic_users_userId_clinicId_unique'
        });


        await queryInterface.addIndex('clinic_users', ['userId']);
        await queryInterface.addIndex('clinic_users', ['clinicId']);
    },

    down: async (queryInterface) => {
        await queryInterface.dropTable('clinic_users');
    }
};
