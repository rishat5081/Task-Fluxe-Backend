"use strict";

module.exports = (sequelize, { DataTypes, Model }) => {
  class ProductLaunchDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.ProductLaunchLists.hasMany(ProductLaunchDetails, {
        foreignKey: "productLaunchListsID",
      });
      ProductLaunchDetails.belongsTo(models.ProductLaunchLists, {
        targetKey: "productLaunchListsID",
        foreignKey: "productLaunchListsID",
      });

      models.User.hasMany(ProductLaunchDetails, {
        foreignKey: "userID",
      });
      ProductLaunchDetails.belongsTo(models.User, {
        targetKey: "userID",
        foreignKey: "userID",
      });
      //project launch can only have one status
      models.ProductLaunchDetailsStatus.hasOne(ProductLaunchDetails, {
        foreignKey: "productLaunchDetailsStatusID",
      });
      ProductLaunchDetails.belongsTo(models.ProductLaunchDetailsStatus, {
        targetKey: "productLaunchDetailsStatusID",
        foreignKey: "productLaunchDetailsStatusID",
      });
      //project launch can only have one Priority
      models.ProductLaunchDetailsPriority.hasOne(ProductLaunchDetails, {
        foreignKey: "productLaunchDetailsPriorityID",
      });
      ProductLaunchDetails.belongsTo(models.ProductLaunchDetailsPriority, {
        targetKey: "productLaunchDetailsPriorityID",
        foreignKey: "productLaunchDetailsPriorityID",
      });

      models.UserLogin.hasMany(ProductLaunchDetails, {
        foreignKey: "userID",
      });
      ProductLaunchDetails.belongsTo(models.UserLogin, {
        targetKey: "userID",
        foreignKey: "userID",
      });
    }
  }
  ProductLaunchDetails.init(
    {
      productLaunchDetailsID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      productLaunchDetailsUUID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      productLaunchDetailsTitle: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      productLaunchDetailsDueDate: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      productLaunchDetailsAssigned: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      productLaunchDetailsDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      productLaunchDetailsComments: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      productLaunchDetailsChecked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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

      productLaunchDetailsPriorityID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "ProductLaunchDetailsPriority",
          key: "productLaunchDetailsPriorityID",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },

      productLaunchDetailsStatusID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "ProductLaunchDetailsStatus",
          key: "productLaunchDetailsStatusID",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      productLaunchListsID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "ProductLaunchLists",
          key: "productLaunchListsID",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      userID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "User",
          key: "userID",
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
      //tableName "productLaunchDetail",
      freezeTableName: true,
      modelName: "ProductLaunchDetails",
    }
  );
  return ProductLaunchDetails;
};
