"use strict";

module.exports = (sequelize, { DataTypes, Model }) => {
  class Supplier_Product_Associate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //many to many relationship
      models.Supplier.belongsToMany(models.Product, {
        through: Supplier_Product_Associate,
        foreignKey: "supplierID",
      });
      //many to many relationship
      models.Product.belongsToMany(models.Supplier, {
        through: Supplier_Product_Associate,
        foreignKey: "productID",
      });
    }
  }
  Supplier_Product_Associate.init(
    {
      supplier_productID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      supplier_productUUID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
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
      //tableName "supplier_Product_Associate",
      freezeTableName: true,
      modelName: "Supplier_Product_Associate",
    }
  );
  return Supplier_Product_Associate;
};
