'use strict';

module.exports = {
    up: async (queryInterface) => {
        const { DataTypes} = require('sequelize');


        await queryInterface.sequelize.query(`
            DO $$ 
            BEGIN
           
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_users_gender') THEN
                    CREATE TYPE "enum_users_gender" AS ENUM ('male', 'female');
                END IF;
                
             
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_users_status') THEN
                    CREATE TYPE "enum_users_status" AS ENUM ('blocked', 'unverified', 'verified');
                END IF;
                
         
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_users_role') THEN
                    CREATE TYPE "enum_users_role" AS ENUM ('patient', 'super_admin', 'ward');
                END IF;
            END $$;
        `);


        await queryInterface.createTable('users', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            fio: {
                type: DataTypes.STRING,
                allowNull: false
            },
            gender: {
                type: DataTypes.ENUM('male', 'female'),
                allowNull: false,
                defaultValue: 'male'
            },
            phone: {
                type: DataTypes.STRING,
                allowNull: false
            },
            misId: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: true
            },
            avatarUrl: {
                type: DataTypes.STRING,
                allowNull: true
            },
            dateOfBirth: {
                type: DataTypes.DATEONLY,
                allowNull: true
            },
            status: {
                type: DataTypes.ENUM('blocked', 'unverified', 'verified'),
                defaultValue: 'unverified',
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                allowNull: true
            },
            role: {
                type: DataTypes.ENUM('patient', 'super_admin', 'ward'),
                allowNull: false,
                defaultValue: 'patient'
            },
            isAdult: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
                allowNull: false
            },
            isNotificationsEnabled: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
                allowNull: false
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

        await queryInterface.addIndex('users', ['phone'], {name: 'users_phone_idx'});
    },

    down: async (queryInterface) => {
        await queryInterface.removeIndex('users', 'users_phone_idx');
        await queryInterface.dropTable('users');


        await queryInterface.sequelize.query(`
            DROP TYPE IF EXISTS "enum_users_gender";
            DROP TYPE IF EXISTS "enum_users_status";
            DROP TYPE IF EXISTS "enum_users_role";
        `);
    }
};