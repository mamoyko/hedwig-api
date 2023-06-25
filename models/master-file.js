"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MasterFiles extends Model {
    static associate(models) {
      // define association here
    }
  }
  MasterFiles.init(
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      filename: DataTypes.STRING,
      file_path: DataTypes.STRING,
      blast_id: DataTypes.STRING,
      invalid_recipients_file: DataTypes.JSON,
    },
    {
      sequelize,
      modelName: "MasterFiles",
    }
  );
  return MasterFiles;
};
