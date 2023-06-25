"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SenderMasks extends Model {
    static associate(models) {
      // define association here
    }
  }
  SenderMasks.init(
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "SenderMasks",
    }
  );
  return SenderMasks;
};
