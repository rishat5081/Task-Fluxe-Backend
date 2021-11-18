"use strict";

module.exports = (sequelize, { DataTypes, Model }) => {
  class InvoiceAttachments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Invoice.hasMany(InvoiceAttachments, { foreignKey: "invoiceID" });
      InvoiceAttachments.belongsTo(models.Invoice, {
        targetKey: "invoiceID",
        foreignKey: "invoiceID",
      });
    }
  }
  InvoiceAttachments.init(
    {
      invoiceAttachID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      invoiceAttachUUID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      invoiceAttachTitle: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      invoiceAttachPath: {
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
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
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
    },
    {
      sequelize,
      //tableName "invoiceAttachment",
      freezeTableName: true,
      modelName: "InvoiceAttachments",
    }
  );
  return InvoiceAttachments;
};
