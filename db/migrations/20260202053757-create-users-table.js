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
                type: DataTypes.INTEGER,
                unique: true,
                allowNull: false
            },
            avatarUrl: {
                type: DataTypes.STRING,
                allowNull: true
            },

            avatarKey: {
                type: DataTypes.STRING(128),
                allowNull: true,
                unique: true
            },
            status: {
                type: DataTypes.ENUM('blocked', 'unverified', 'verified'),
                defaultValue: 'unverified',
                allowNull: false
            },

            role: {
                type: DataTypes.ENUM('patient', 'super_admin', 'ward'),
                allowNull: false,
                defaultValue: 'patient'
            },

            isNotificationsEnabled: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
                allowNull: false
            },

            isFaceId: {
                type: DataTypes.BOOLEAN,
                defaultValue:false,
                allowNull: false
            },
            isCodPass: {
                type: DataTypes.BOOLEAN,
                defaultValue:false,
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
            },
            deletedAt: {
                type: DataTypes.DATE,
                allowNull: true
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