const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Photo = sequelize.define("Photo", {
  filename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Photo;
