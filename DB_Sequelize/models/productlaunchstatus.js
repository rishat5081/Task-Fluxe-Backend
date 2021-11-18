"use strict";

module.exports = (sequelize, { DataTypes, Model }) => {
  class ProductLaunchStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ProductLaunchStatus.init(
    {
      productLaunchStatusID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      productLaunchStatusUUID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      productLaunchStatusTitle: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      productLaunchStatusColor: {
        type: DataTypes.STRING,
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
    },
    {
      sequelize,
      //tableName "productLaunchStatus",
      freezeTableName: true,
      modelName: "ProductLaunchStatus",
    }
  );
  return ProductLaunchStatus;
};
