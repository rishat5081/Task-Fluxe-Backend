"use strict";

module.exports = (sequelize, { DataTypes, Model }) => {
  class ProductLaunchDetailsPriority extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ProductLaunchDetailsPriority.init(
    {
      productLaunchDetailsPriorityID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      productLaunchDetailsPriorityUUID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      productLaunchDetailsPriorityTitle: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      productLaunchDetailsPriorityColor: {
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
      //tableName "productLaunchDetailsPriority",
      freezeTableName: true,
      modelName: "ProductLaunchDetailsPriority",
    }
  );
  return ProductLaunchDetailsPriority;
};
