"use strict";

module.exports = (sequelize, { DataTypes, Model }) => {
  class ProductPackingOption extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Product.hasMany(ProductPackingOption, { foreignKey: "productID" });
      ProductPackingOption.belongsTo(models.Product, {
        targetKey: "productID",
        foreignKey: "productID",
      });
    }
  }
  ProductPackingOption.init(
    {
      productPackingID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      productPackingUUID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      productPackingTitle: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      productPackingDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      productPackingType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      productPackingPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
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
      //tableName "productPackingOption",
      freezeTableName: true,
      modelName: "ProductPackingOption",
    }
  );
  return ProductPackingOption;
};
