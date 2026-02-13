'use strict';


module.exports = {
    up: async (queryInterface) => {
        const transaction = await queryInterface.sequelize.transaction();

        try {

            await queryInterface.removeColumn('users', 'fio', { transaction });
            await queryInterface.removeColumn('users', 'dateOfBirth', { transaction });

            await queryInterface.removeColumn('users', 'email', { transaction });

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    down: async (queryInterface) => {
        const { DataTypes } = require('sequelize');
        const transaction = await queryInterface.sequelize.transaction();

        try {

            await queryInterface.addColumn('users', 'fio', {
                type: DataTypes.STRING,
                allowNull: false
            }, { transaction });

            await queryInterface.addColumn('users', 'dateOfBirth', {
                type: DataTypes.DATEONLY,
                allowNull: true
            }, { transaction });


            await queryInterface.addColumn('users', 'email', {
                type: DataTypes.STRING,
                allowNull: true
            }, { transaction });

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
};
