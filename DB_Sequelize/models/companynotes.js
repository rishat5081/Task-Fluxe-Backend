"use strict";
module.exports = (sequelize, { DataTypes, Model }) => {
  class CompanyNotes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.company.hasMany(CompanyNotes, { foreignKey: "companyID" });
      CompanyNotes.belongsTo(models.company, {
        targetKey: "companyID",
        foreignKey: "companyID",
      });
    }
  }
  CompanyNotes.init(
    {
      notesID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      notesUUID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      noteTitle: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      noteText: {
        type: DataTypes.TEXT,
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
    },
    {
      sequelize,
      //tableName "companyNote",
      freezeTableName: true,
      modelName: "CompanyNotes",
    }
  );
  return CompanyNotes;
};
