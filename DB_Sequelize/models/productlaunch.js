"use strict";

module.exports = (sequelize, { DataTypes, Model }) => {
  class ProductLaunch extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // models.Supplier.hasMany(ProductLaunch, { foreignKey: "supplierID" });
      // ProductLaunch.belongsTo(models.Supplier, {
      //   targetKey: "supplierID",
      //   foreignKey: "supplierID",
      // });

      models.Product.hasMany(ProductLaunch, { foreignKey: "productID" });
      ProductLaunch.belongsTo(models.Product, {
        targetKey: "productID",
        foreignKey: "productID",
      });

      models.ProductLaunchStatus.hasOne(ProductLaunch, {
        foreignKey: "productLaunchStatusID",
      });
      ProductLaunch.belongsTo(models.ProductLaunchStatus, {
        targetKey: "productLaunchStatusID",
        foreignKey: "productLaunchStatusID",
      });

      models.UserLogin.hasMany(ProductLaunch, {
        foreignKey: "userID",
      });
      ProductLaunch.belongsTo(models.UserLogin, {
        targetKey: "userID",
        foreignKey: "userID",
      });
    }
  }
  ProductLaunch.init(
    {
      productLaunchID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      productLaunchUUID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      productLaunchTitle: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      productLaunchComments: {
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
      productID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Product",
          key: "productID",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      // supplierID: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   references: {
      //     model: "supplier",
      //     key: "supplierID",
      //   },
      //   onDelete: "CASCADE",
      //   onUpdate: "CASCADE",
      // },
      productLaunchStatusID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "ProductLaunchStatus",
          key: "productLaunchStatusID",
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
      //tableName: "productLaunch",
      freezeTableName: true,
      modelName: "ProductLaunch",
    }
  );
  return ProductLaunch;
};
