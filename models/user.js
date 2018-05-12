"use strict";
module.exports = (sequelize, Sequelize) => {
    var User = sequelize.define("User", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        username: {
            type: Sequelize.STRING,
            unique: true
        },
        password: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING,
            unique: true
        },
        college :{
            type: Sequelize.STRING,
            allowNull: true
        },
        branch :{
            type: Sequelize.STRING,
            allowNull: true
        },
        RefrenceId: {
            type: Sequelize.UUID,
            allowNull: true
        },
        token: {
            type: Sequelize.STRING,
            defaultValue: null
        },
        totpsecret: {
            type: Sequelize.STRING,
            defaultValue: null
        },
        isotpenabled: {
            type: Sequelize.BOOLEAN,
            defaultValue: null
        }
    });
    return User;
};