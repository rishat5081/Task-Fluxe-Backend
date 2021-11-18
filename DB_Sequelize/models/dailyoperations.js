"use strict";

module.exports = (sequelize, { DataTypes, Model }) => {
  class DailyOperations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Project.hasMany(DailyOperations, { foreignKey: "projectID" });
      DailyOperations.belongsTo(models.Project, {
        targetKey: "projectID",
        foreignKey: "projectID",
      });
    }
  }
  DailyOperations.init(
    {
      dailyOperationID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      dailyOperationUUID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      dailyOperationTitle: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dailyOperationDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      dailyOperationImage: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      dailyOperationAttachment: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      projectID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Project",
          key: "projectID",
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
      //tableName "dailyOperation",
      freezeTableName: true,
      modelName: "DailyOperations",
    }
  );
  return DailyOperations;
};
