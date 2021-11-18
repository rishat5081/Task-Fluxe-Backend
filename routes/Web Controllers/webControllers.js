const DataBase = require("../../DB_Sequelize/models"),
  Sequelize = require("sequelize"),
  bcrypt = require("bcrypt"),
  saltRounds = 10;

export async function webControllers(fastify, options) {
  //POST
  //sign up

  fastify.route({
    method: "POST",
    url: "/signUp",
    logLevel: "warn",
    body: {
      confirmpassword: { type: "string" },
      email: { type: "string" },
      firstname: { type: "string" },
      lastName: { type: "string" },
      password: { type: "string" },
    },
    preHandler: async (request, reply) => {
      let dbResponse = await DataBase.UserLogin.findOne({
        where: {
          email: request.body.email,
        },
      });

      if (dbResponse === null) return;
      else reply.send({ status: "Error", message: "Email Already Exists" });
    },
    handler: async (request, reply) => {
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
        return reply
          .code(200)
          .send({ status: "Created", message: "Account Created Succesfully" });
      } else {
        return reply
          .code(500)
          .send({ status: "Error", message: "Error Creating Account" });
      }
      return reply;
    },
  });

  //POST
  //Login
  fastify.route({
    method: "POST",
    url: "/login",
    logLevel: "warn",
    body: {
      email: { type: "string" },
      password: { type: "string" },
    },
    // preHandler: async (request, reply) => {
    //   let dbResponse = await DataBase.UserLogin.findOne({
    //     where: {
    //       email: request.body.email,
    //     },
    //   });

    //   if (dbResponse === null) return;
    //   else reply.send({ status: "Error", message: "Email Already Exists" });
    // },
    handler: async (request, reply) => {
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
          return reply.code(200).send({
            status: "success",
            id: dbResponse.dataValues.userID,
            message: "Logged In Succesfully",
          });
        } else {
          return reply.code(200).send({
            status: "Error",
            message: "Incorrect Password",
          });
        }
      } else {
        return reply
          .code(500)
          .send({ status: "Error", message: "Error Finding Account" });
      }
      return reply;
    },
  });
}
