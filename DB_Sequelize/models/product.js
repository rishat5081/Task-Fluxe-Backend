"use strict";

module.exports = (sequelize, { DataTypes, Model }) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.company.hasMany(Product, { foreignKey: "companyID" });
      Product.belongsTo(models.company, {
        targetKey: "companyID",
        foreignKey: "companyID",
      });

      models.UserLogin.hasMany(Product, {
        foreignKey: "userID",
      });
      Product.belongsTo(models.UserLogin, {
        targetKey: "userID",
        foreignKey: "userID",
      });
    }
  }
  Product.init(
    {
      productID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      productUUID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      productName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      productDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      productUnit: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      productPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      productSalePrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      productOtherDetails: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      productSampleText: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      length: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      width: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      height: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      color: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rawMaterial: {
        type: DataTypes.TEXT,
        allowNull: false,
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
      //tableName "product",
      freezeTableName: true,
      modelName: "Product",
    }
  );
  return Product;
};
