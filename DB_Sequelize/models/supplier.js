"use strict";

module.exports = (sequelize, { DataTypes, Model }) => {
  class Supplier extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.company.hasMany(Supplier, { foreignKey: "companyID" });
      Supplier.belongsTo(models.company, {
        targetKey: "companyID",
        foreignKey: "companyID",
      });

      models.UserLogin.hasMany(Supplier, {
        foreignKey: "userID",
      });
      Supplier.belongsTo(models.UserLogin, {
        targetKey: "userID",
        foreignKey: "userID",
      });
    }
  }
  Supplier.init(
    {
      supplierID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      supplierUUID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      supplierName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      supplierWeb: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      supplierPhone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      supplierPosition: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      supplierEmail: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      supplierMobile: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      supplierAddress: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      supplierLogo: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      supplierNote: {
        type: DataTypes.TEXT,
        allowNull: true,
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
      companyID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "company",
          key: "companyID",
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
      //tableName "supplier",
      freezeTableName: true,
      modelName: "Supplier",
    }
  );
  return Supplier;
};
