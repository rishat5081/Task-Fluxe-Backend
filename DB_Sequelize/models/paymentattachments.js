"use strict";

module.exports = (sequelize, { DataTypes, Model }) => {
  class PaymentAttachments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Payment.hasMany(PaymentAttachments, { foreignKey: "paymentID" });
      PaymentAttachments.belongsTo(models.Payment, {
        targetKey: "paymentID",
        foreignKey: "paymentID",
      });
    }
  }
  PaymentAttachments.init(
    {
      paymentAttachID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      paymentAttachUUID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      paymentAttachTitle: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      paymentAttachPath: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      paused: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      paymentID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Payment",
          key: "paymentID",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      //tableName "paymentAttachment",
      freezeTableName: true,
      modelName: "PaymentAttachments",
    }
  );
  return PaymentAttachments;
};
