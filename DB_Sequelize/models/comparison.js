"use strict";

module.exports = (sequelize, { DataTypes, Model }) => {
  class Comparison extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.ComparisonRating.hasOne(Comparison, {
        foreignKey: "comparisonRatingID",
      });
      Comparison.belongsTo(models.ComparisonRating, {
        targetKey: "comparisonRatingID",
        foreignKey: "comparisonRatingID",
      });

      models.UserLogin.hasMany(Comparison, {
        foreignKey: "userID",
      });
      Comparison.belongsTo(models.UserLogin, {
        targetKey: "userID",
        foreignKey: "userID",
      });
    }
  }
  Comparison.init(
    {
      comparisonID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      comparisonUUID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      comparisonTitle: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      comparisonDescription: {
        type: DataTypes.TEXT,
        defaultValue: null,
        allowNull: true,
      },
      note: {
        type: DataTypes.TEXT,
        defaultValue: null,
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
      comparisonRatingID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        references: {
          model: "ComparisonRating",
          key: "comparisonRatingID",
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
      //tableName "comparison",
      freezeTableName: true,
      modelName: "Comparison",
    }
  );
  return Comparison;
};
