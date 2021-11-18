// import Sequelize from "sequelize";
// import enVariables from "../config/config.js";
// import { AllModels } from "../models/allModels.js";
// const env = process.env.NODE_ENV || "development";
// const config = enVariables[env];
// const DataBase = {};

// let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config, {
//     logging: false,
//   });
// } else {
//   sequelize = new Sequelize(
//     config.database,
//     config.username,
//     config.password,
//     config,
//     {
//       logging: false,
//     }
//   );
// }

// for (const iterator of AllModels) {
//   // console.log(iterator);
//   const model = iterator(sequelize, Sequelize);
//   DataBase[model.name] = model;
// }

// Object.keys(DataBase).forEach((modelName) => {
//   if (DataBase[modelName].associate) {
//     DataBase[modelName].associate(DataBase);
//   }
// });

// DataBase.sequelize = sequelize;

// //DataBase.UserLogin.sync({ force: true }).then((res) => console.log(res));
// // DataBase.InvoiceStatus.sync({ force: true }).then((res) => console.log(res));
// module.exports = DataBase;
// // DataBase.UserLogin.create({
// //   firstName: "Testing",
// //   lastName: "Testing",
// //   email: "Testing",
// //   password: "Testing",
// // }).then((res) => console.log(res));
"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
