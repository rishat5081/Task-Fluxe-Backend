const DataBase = require("../../DB_Sequelize/models"),
  Sequelize = require("sequelize"),
  bcrypt = require("bcrypt"),
  router = require("express").Router(),
  saltRounds = 10;

//POST
//sign up

const preHandler = async (request, reply, next) => {
  let dbResponse = await DataBase.UserLogin.findOne({
    where: {
      email: request.body.email,
    },
  });

  if (dbResponse === null) next();
  else {
    reply.send({ status: "Error", message: "Email Already Exists" });
    reply.end();
  }
};

router.route("/signUp").post(preHandler, async (request, reply) => {
  const hashedPassword = bcrypt.hashSync(request.body.password, saltRounds);
  //creating User
  let dbResponse = await DataBase.UserLogin.create({
    firstName: request.body.firstname,
    lastName: request.body.lastName,
    email: request.body.email,
    password: hashedPassword,
  }).catch((err) => {
    if (err) {
      console.log("Error Creating Account");
      console.trace(err);
    }
  });

  if (dbResponse) {
    reply
      .status(200)
      .send({ status: "Created", message: "Account Created Succesfully" });
    reply.end();
  } else {
    reply
      .status(500)
      .send({ status: "Error", message: "Error Creating Account" });
    reply.end();
  }
});

//POST
//Login
router.route("/login").post(async (request, reply) => {
  //creating User
  let dbResponse = await DataBase.UserLogin.findOne({
    attributes: ["userID", "email", "password"],
    where: {
      email: request.body.email,
      paused: false,
      deleted: false,
    },
    // password: hashedPassword,
  }).catch((err) => {
    if (err) {
      console.log("Error Finding Account");
      console.trace(err);
    }
  });

  if (dbResponse) {
    const comparePassword = bcrypt.compareSync(
      request.body.password,
      dbResponse.dataValues.password
    );
    if (comparePassword) {
      reply.status(200).send({
        status: "success",
        id: dbResponse.dataValues.userID,
        message: "Logged In Succesfully",
      });
      reply.end();
      return;
    } else {
      reply.status(200).send({
        status: "Error",
        message: "Incorrect Password",
      });
      reply.end();
      return;
    }
  } else {
    reply
      .status(500)
      .send({ status: "Error", message: "Error Finding Account" });
    reply.end();
    return;
  }
});

module.exports = router;
