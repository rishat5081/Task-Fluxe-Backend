"use strict";

module.exports = (sequelize, { DataTypes, Model }) => {
  class InvoiceDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      models.Invoice.hasMany(InvoiceDetails, { foreignKey: "invoiceID" });
      InvoiceDetails.belongsTo(models.Invoice, {
        targetKey: "invoiceID",
        foreignKey: "invoiceID",
      });
    }
  }
  InvoiceDetails.init(
    {
      invoiceDetailsID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      invoiceDetailsUUID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      invoiceDetailsTitle: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      invoiceDetailsNotes: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      invoiceDetailsUnitPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      Size: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Discount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      ShippingCost: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      DueDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      Status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Note: {
        type: DataTypes.TEXT,
        allowNull: false,
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
      //tableName "invoiceDetail",
      freezeTableName: true,
      modelName: "InvoiceDetails",
    }
  );
  return InvoiceDetails;
};
