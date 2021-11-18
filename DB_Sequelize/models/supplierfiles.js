"use strict";

module.exports = (sequelize, { DataTypes, Model }) => {
  class SupplierFiles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      models.company.hasMany(SupplierFiles, { foreignKey: "companyID" });
      SupplierFiles.belongsTo(models.company, {
        targetKey: "companyID",
        foreignKey: "companyID",
      });

      models.Supplier.hasMany(SupplierFiles, { foreignKey: "supplierID" });
      SupplierFiles.belongsTo(models.Supplier, {
        targetKey: "supplierID",
        foreignKey: "supplierID",
      });
    }
  }
  SupplierFiles.init(
    {
      fileID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      fileUUID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      fileTitle: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      filePath: {
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
      //tableName "supplierFile",
      freezeTableName: true,
      modelName: "SupplierFiles",
    }
  );
  return SupplierFiles;
};
