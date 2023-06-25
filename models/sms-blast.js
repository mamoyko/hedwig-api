"use strict";
const { Model } = require("sequelize");
const {
  RECIPIENT_TYPE_ENUMS,
  SMS_BLAST_STATUS_ENUMS,
} = require("../constants");
module.exports = (sequelize, DataTypes) => {
  class SmsBlasts extends Model {
    static associate(models) {
      // define association here
    }
  }
  SmsBlasts.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      name: DataTypes.STRING,
      recipient_type: {
        type: DataTypes.ENUM,
        values: RECIPIENT_TYPE_ENUMS,
      },
      status: {
        type: DataTypes.ENUM,
        values: SMS_BLAST_STATUS_ENUMS,
      },
      message: DataTypes.STRING,
      phone_number: DataTypes.STRING,
      sender_masks_id: DataTypes.STRING,
      user_id: DataTypes.STRING,
      vcm_transaction_id: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "SmsBlasts",
    }
  );
  return SmsBlasts;
};
