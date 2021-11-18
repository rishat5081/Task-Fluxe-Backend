"use strict";

module.exports = (sequelize, { DataTypes, Model }) => {
  class ProductLaunchLists extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.ProductLaunch.hasMany(ProductLaunchLists, {
        foreignKey: "productLaunchID",
      });
      ProductLaunchLists.belongsTo(models.ProductLaunch, {
        targetKey: "productLaunchID",
        foreignKey: "productLaunchID",
      });

      models.UserLogin.hasMany(ProductLaunchLists, {
        foreignKey: "userID",
      });
      ProductLaunchLists.belongsTo(models.UserLogin, {
        targetKey: "userID",
        foreignKey: "userID",
      });
    }
  }
  ProductLaunchLists.init(
    {
      productLaunchListsID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      productLaunchListsUUID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      productLaunchListsTitle: {
        type: DataTypes.STRING,
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
      productLaunchID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "ProductLaunch",
          key: "productLaunchID",
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
      //tableName "productLaunchList",
      freezeTableName: true,
      modelName: "ProductLaunchLists",
    }
  );
  return ProductLaunchLists;
};
