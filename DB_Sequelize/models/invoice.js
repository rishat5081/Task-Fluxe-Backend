"use strict";

module.exports = (sequelize, { DataTypes, Model }) => {
  class Invoice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Supplier.hasMany(Invoice, { foreignKey: "supplierID" });
      Invoice.belongsTo(models.Supplier, {
        targetKey: "supplierID",
        foreignKey: "supplierID",
      });

      models.Product.hasMany(Invoice, { foreignKey: "productID" });
      Invoice.belongsTo(models.Product, {
        targetKey: "productID",
        foreignKey: "productID",
      });

      models.InvoiceStatus.hasOne(Invoice, { foreignKey: "invoiceStatusID" });
      Invoice.belongsTo(models.InvoiceStatus, {
        targetKey: "invoiceStatusID",
        foreignKey: "invoiceStatusID",
      });

      models.UserLogin.hasMany(Invoice, {
        foreignKey: "userID",
      });
      Invoice.belongsTo(models.UserLogin, {
        targetKey: "userID",
        foreignKey: "userID",
      });
    }
  }
  Invoice.init(
    {
      invoiceID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      invoiceUUID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      invoiceTitle: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      invoiceDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      invoiceTotal: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      invoicePaid: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      invoiceOutStanding: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      invoiceDueDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      invoiceFileTitle: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      invoiceFile: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      invoiceNotes: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
      },
      userID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        references: {
          model: "UserLogin",
          key: "userID",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      productID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Product",
          key: "productID",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      supplierID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Supplier",
          key: "supplierID",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      invoiceStatusID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "InvoiceStatus",
          key: "invoiceStatusID",
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
      //tableName "invoice",
      freezeTableName: true,
      modelName: "Invoice",
    }
  );
  return Invoice;
};
