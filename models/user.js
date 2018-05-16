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
            unique: true,
            allowNull : false
        },
        college :{
            type: Sequelize.STRING,
            defaultValue: "N/A",
        },
        branch :{
            type: Sequelize.STRING,
            efaultValue: "N/A",
        },
        RefrenceId: {
            type: Sequelize.STRING,
            efaultValue: "N/A",
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
