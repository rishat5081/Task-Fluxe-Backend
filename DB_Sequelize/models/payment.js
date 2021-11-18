"use strict";

module.exports = (sequelize, { DataTypes, Model }) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Invoice.hasMany(Payment, { foreignKey: "invoiceID" });
      Payment.belongsTo(models.Invoice, {
        targetKey: "invoiceID",
        foreignKey: "invoiceID",
      });
    }
  }
  Payment.init(
    {
      paymentID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      paymentUUID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      paymentTitle: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      paymentDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      paymentTotal: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      paymentPaidAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      paymentCreditAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      paymentStatus: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      paymentFile: {
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
      invoiceID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Invoice",
          key: "invoiceID",
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
      //tableName "payment",
      freezeTableName: true,
      modelName: "Payment",
    }
  );
  return Payment;
};
