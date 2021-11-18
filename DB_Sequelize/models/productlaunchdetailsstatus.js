"use strict";

module.exports = (sequelize, { DataTypes, Model }) => {
  class ProductLaunchDetailsStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ProductLaunchDetailsStatus.init(
    {
      productLaunchDetailsStatusID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      productLaunchDetailsStatusUUID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      productLaunchDetailsTitle: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      productLaunchDetailsColor: {
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
      //tableName "productLaunchDetailsStatus",
      freezeTableName: true,
      modelName: "ProductLaunchDetailsStatus",
    }
  );
  return ProductLaunchDetailsStatus;
};
