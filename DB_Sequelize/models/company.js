"use strict";

module.exports = (sequelize, { DataTypes, Model }) => {
  class company extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.UserLogin.hasMany(company, {
        foreignKey: "userID",
      });
      company.belongsTo(models.UserLogin, {
        targetKey: "userID",
        foreignKey: "userID",
      });
    }
    // toJSON(){
    //   return {...}
    // }
  }
  company.init(
    {
      companyID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      companyUUID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      companyName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      companyWeb: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      companyPhone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      companyAddress: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      companyLogo: {
        type: DataTypes.TEXT,
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
      //tableName "company",
      modelName: "company",
    }
  );
  return company;
};
