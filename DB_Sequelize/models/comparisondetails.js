"use strict";

module.exports = (sequelize, { DataTypes, Model }) => {
  class ComparisonDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      models.Comparison.hasMany(ComparisonDetails, {
        foreignKey: "comparisonID",
      });
      ComparisonDetails.belongsTo(models.Comparison, {
        targetKey: "comparisonID",
        foreignKey: "comparisonID",
      });

      models.ComparisonSupplierRating.hasOne(ComparisonDetails, {
        foreignKey: "comparisonSupplierRatingID",
      });
      ComparisonDetails.belongsTo(models.ComparisonSupplierRating, {
        targetKey: "comparisonSupplierRatingID",
        foreignKey: "comparisonSupplierRatingID",
      });

      models.UserLogin.hasMany(ComparisonDetails, {
        foreignKey: "userID",
      });
      ComparisonDetails.belongsTo(models.UserLogin, {
        targetKey: "userID",
        foreignKey: "userID",
      });
    }
  }
  ComparisonDetails.init(
    {
      comparisonDetailsID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      comparisonDetailsUUID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      rating: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      companyName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      website: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      email: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      productCost: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      productShippingCost: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      productOtherCost: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      productTotalCost: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      productSalePrice: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      productExpectedRevenue: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      packagingOption: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      leadTime: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      sampleInformation: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      comments: {
        type: DataTypes.TEXT,
        allowNull: true,
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
      comparisonID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Comparison",
          key: "comparisonID",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      comparisonSupplierRatingID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "ComparisonSupplierRating",
          key: "comparisonSupplierRatingID",
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
      //tableName "comparisonDetail",
      freezeTableName: true,
      modelName: "ComparisonDetails",
    }
  );
  return ComparisonDetails;
};
