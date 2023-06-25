"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SplittedFiles extends Model {
    static associate(models) {
      // define association here
    }
  }
  SplittedFiles.init(
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      master_file_id: DataTypes.STRING,
      filename: DataTypes.STRING,
      file_path: DataTypes.STRING,
      vcm_transaction_id: DataTypes.STRING,
      blast_id: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "SplittedFiles",
    }
  );
  return SplittedFiles;
};
