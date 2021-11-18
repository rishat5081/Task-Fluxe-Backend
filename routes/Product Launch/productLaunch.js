const DataBase = require("../../DB_Sequelize/models"),
  Sequelize = require("sequelize");
export async function productLaunchRoute(fastify, options) {
  //GET
  //getting all the product launch and status for the main page table
  fastify.route({
    method: "GET",
    url: "/getProductLaunchList",
    logLevel: "warn",
    handler: async (request, reply) => {
      let productList = await DataBase.ProductLaunch.findAll({
        attributes: ["productLaunchUUID", "productLaunchTitle"],
        where: {
          paused: false,
          deleted: false,
          userID: request.query.id,
        },
        include: {
          model: DataBase.ProductLaunchStatus,
          required: true,
          attributes: ["productLaunchStatusTitle", "productLaunchStatusColor"],
          where: {
            paused: false,
            deleted: false,
          },
        },
      })
        .then((response) => {
          if (response) {
            return response;
          } else {
            return null;
          }
        })
        .catch((err) => {
          if (err) {
            return null;
          }
        });

      if (productList) {
        return reply.code(200).send({ productList });
      } else {
        console.log("Error Fetching all Product Names");
        console.trace("Error Fetching all Product Names");
        reply.code(500).send("Error Please try Again");
      }
    },
  });

  //get
  //getting all product names for the adding a new product launch from the existing products
  fastify.route({
    method: "GET",
    url: "/getProductNames",
    logLevel: "warn",
    handler: async (request, reply) => {
      let productList = await DataBase.Product.findAll({
        attributes: ["productUUID", "productName"],
        where: {
          paused: false,
          deleted: false,
        },
      })
        .then((response) => {
          if (response) {
            return response;
          } else {
            return null;
          }
        })
        .catch((err) => {
          if (err) {
            return null;
          }
        });

      if (productList) {
        reply.code(200).send({ productList });
      } else {
        console.log("Error Fetching all Product Names");
        console.trace("Error Fetching all Product Names");
        reply.code(500).send("Error Please try Again");
      }
    },
  });
  //POST
  //getting all product names for the adding a new product launch from the existing products
  fastify.route({
    method: "POST",
    url: "/addExistingProducttoLanch",
    logLevel: "warn",
    body: {
      productUUID: { type: "string" },
    },
    handler: async (request, reply) => {
      //getting the product ID and name
      let productList = await DataBase.Product.findOne({
        attributes: ["productID", "productName"],
        where: {
          productUUID: request.body.productUUID,
          paused: false,
          deleted: false,
        },
      })
        .then((response) => {
          if (response) {
            return response;
          } else {
            return null;
          }
        })
        .catch((err) => {
          if (err) {
            console.log("Error Fetching  Product  Status");
            console.trace(err);
            return null;
          }
        });

      let status = await DataBase.ProductLaunchStatus.findOne({
        attributes: ["productLaunchStatusID"],
        where: {
          productLaunchStatusTitle: { [Sequelize.Op.like]: "%Progress%" },
          paused: false,
          deleted: false,
        },
      })
        .then((response) => {
          if (response) {
            return response;
          } else {
            return null;
          }
        })
        .catch((err) => {
          if (err) {
            console.log("Error Fetching  Product Launch Status");
            console.trace(err);
            return null;
          }
        });

      if ((productList, status) !== null) {
        DataBase.ProductLaunch.create({
          productLaunchTitle: productList.dataValues.productName,
          productID: productList.dataValues.productID,
          productLaunchStatusID: status.dataValues.productLaunchStatusID,
          userID: 1,
        })
          .then((result) => {
            if (result) {
              return reply.code(200).send({ result, status: "Created" });
            }
          })
          .catch((err) => {
            if (err) {
              console.log("Error Creating  Product Launch");
              console.trace(err);
              reply.code(500).send("Error Please try Again");
              return err;
            }
          });
      } else {
        console.log("Error Creating  Product Launch");
        console.trace("Error Creating  Product Launch");
        return reply.code(500).send("Error Please try Again");
      }
    },
  });
  //POST
  //creating a new product launch from the existing products
  fastify.route({
    method: "POST",
    url: "/addNewProducttoLaunch",
    logLevel: "warn",
    body: {
      productName: { type: "string" },
    },
    handler: async (request, reply) => {
      let status = await DataBase.ProductLaunchStatus.findOne({
        attributes: ["productLaunchStatusID"],
        where: {
          productLaunchStatusTitle: { [Sequelize.Op.like]: "%Progress%" },
          paused: false,
          deleted: false,
        },
      })
        .then((response) => {
          if (response) {
            return response;
          } else {
            return null;
          }
        })
        .catch((err) => {
          if (err) {
            console.log("Error Fetching  Product Launch Status");
            console.trace(err);
            return err;
          }
        });

      if (status !== null) {
        DataBase.ProductLaunch.create({
          productLaunchTitle: request.body.productName,
          productLaunchStatusID: status.dataValues.productLaunchStatusID,
          userID: 1,
        })
          .then((result) => {
            if (result) {
              return reply.code(200).send({ result, status: "Created" });
            }
          })
          .catch((err) => {
            if (err) {
              console.log("Error Creating  Product Launch");
              console.trace(err);
              return reply.code(500).send("Error Please try Again");
            }
          });
      } else {
        console.log("Error Creating  Product Launch");
        console.trace("Error Creating  Product Launch");
        return reply.code(500).send("Error Please try Again");
      }
    },
  });

  // ------------------------------------  End of Product Launch Page  ------------------------------------------------
  /**
   *
   *
   *
   *
   *
   *
   */
  // ------------------------------------  Start of Product Launch Tracking Page ------------------------------------------------

  //POST
  //creating a new product launch tracking list
  fastify.route({
    method: "POST",
    url: "/createNewTaskList",
    logLevel: "warn",
    body: {
      listName: { type: "string" },
      productLaunchUUID: { type: "string" },
    },
    handler: async (request, reply) => {
      //getting the ID of the product Launch

      let productLaunchID = await DataBase.ProductLaunch.findOne({
        attributes: ["productLaunchID"],
        where: {
          productLaunchUUID: request.body.productLaunchUUID,
          paused: false,
          deleted: false,
        },
      })
        .then((response) => {
          if (response) {
            return response;
          } else {
            return null;
          }
        })
        .catch((err) => {
          if (err) {
            console.log("Error Fetching Product Launch Details");
            console.trace(err);
            return err;
          }
        });

      if (productLaunchID !== null) {
        let createdStatus = await DataBase.ProductLaunchLists.create({
          productLaunchListsTitle: request.body.listName,
          productLaunchID: productLaunchID.dataValues.productLaunchID,
          userID: request.body.userID,
        })
          .then((response) => {
            if (response) {
              return response;
            } else {
              return null;
            }
          })
          .catch((err) => {
            if (err) {
              console.log("Error Fetching Product Launch Details");
              console.trace(err);
              return err;
            }
          });
        if (createdStatus)
          return reply
            .code(200)
            .send({ result: createdStatus, status: "Created" });
        else {
          console.log("Error Creating  Product Launch");
          console.trace(err);
          return reply.code(500).send("Error Please try Again");
        }
      } else {
        console.log("Error Creating  Product Launch");
        console.trace("Error Creating  Product Launch");
        return reply.code(500).send("Error Please try Again");
      }
    },
  });

  //GET
  //Query Parameter
  fastify.route({
    method: "GET",
    url: "/getProductLaunchDetails",
    schema: {
      // request needs to have a querystring with a `name` parameter
      querystring: {
        productLaunchUUID: { type: "string" },
      },
    },
    handler: async (request, reply) => {
      //getting the product launch ID
      let productLaunchDetails = await DataBase.ProductLaunch.findOne({
        attributes: [
          "productLaunchID",
          "productLaunchUUID",
          "productLaunchTitle",
          "productLaunchComments",
        ],
        where: {
          productLaunchUUID: request.query.productLaunchUUID,
          paused: false,
          deleted: false,
        },
      })
        .then((response) => {
          if (response) {
            return response;
          } else {
            return null;
          }
        })
        .catch((err) => {
          if (err) {
            console.log("Error Fetching all Supplier Comparison");
            console.trace(err);
            return null;
          }
        });

      if (productLaunchDetails) {
        let productLaunchTaskLists = await DataBase.ProductLaunchLists.findAll({
          attributes: ["productLaunchListsUUID", "productLaunchListsTitle"],
          where: {
            productLaunchID: productLaunchDetails.dataValues.productLaunchID,
            paused: false,
            deleted: false,
          },
          include: {
            model: DataBase.ProductLaunchDetails,
            attributes: [
              "productLaunchDetailsUUID",
              "productLaunchDetailsTitle",
              "productLaunchDetailsDueDate",
              "productLaunchDetailsAssigned",
              "productLaunchDetailsComments",
              "productLaunchDetailsChecked",
            ],
            required: false,
            where: {
              paused: false,
              deleted: false,
            },
            include: [
              {
                model: DataBase.ProductLaunchDetailsStatus,
                attributes: [
                  "productLaunchDetailsTitle",
                  "productLaunchDetailsColor",
                ],
                where: {
                  paused: false,
                  deleted: false,
                },
              },
              {
                model: DataBase.ProductLaunchDetailsPriority,
                attributes: [
                  "productLaunchDetailsPriorityTitle",
                  "productLaunchDetailsPriorityColor",
                ],
                where: {
                  paused: false,
                  deleted: false,
                },
              },
            ],
          },
        })
          .then((response) => {
            if (response) {
              return response;
            } else {
              return null;
            }
          })
          .catch((err) => {
            if (err) {
              console.log("Error Fetching all Product Launch Tracking Details");
              console.trace(err);
              return null;
            }
          });

        if (productLaunchTaskLists) {
          return reply.code(200).send({
            productLaunchTaskLists,
            productLaunchDetails,
          });
        }
      } else {
        return reply.code(500).send({
          status: "Error",
          message: "Can not get the Details",
        });
      }
    },
  });

  //Get
  //getting the status and priority
  fastify.route({
    method: "GET",
    url: "/getPriorityAndStatus",

    handler: async (request, reply) => {
      //getting the product launch ID
      let productLaunchDetailsStatus =
        await DataBase.ProductLaunchDetailsStatus.findAll({
          attributes: [
            "productLaunchDetailsStatusUUID",
            "productLaunchDetailsTitle",
            "productLaunchDetailsColor",
          ],
          where: {
            paused: false,
            deleted: false,
          },
        })
          .then((response) => {
            if (response) {
              return response;
            } else {
              return null;
            }
          })
          .catch((err) => {
            if (err) {
              console.log("Error Fetching all Product Launch Details Status");
              console.trace(err);
              return null;
            }
          });

      let productLaunchDetailsPriority =
        await DataBase.ProductLaunchDetailsPriority.findAll({
          attributes: [
            "productLaunchDetailsPriorityUUID",
            "productLaunchDetailsPriorityTitle",
            "productLaunchDetailsPriorityColor",
          ],
          where: {
            paused: false,
            deleted: false,
          },
        })
          .then((response) => {
            if (response) {
              return response;
            } else {
              return null;
            }
          })
          .catch((err) => {
            if (err) {
              console.log("Error Fetching all Product Launch Details Priority");
              console.trace(err);
              return null;
            }
          });

      if ((productLaunchDetailsPriority, productLaunchDetailsStatus)) {
        return reply.code(200).send({
          productLaunchDetailsPriority,
          productLaunchDetailsStatus,
        });
      } else {
        return reply.code(500).send({
          status: "Error",
          message: "Can not get the Details",
        });
      }
    },
  });

  //Post
  //Create New Task
  fastify.route({
    method: "POST",
    url: "/addNewTask",
    logLevel: "warn",
    body: {
      productListUUID: { type: "string" },
      taskName: { type: "string" },
      date: { type: "string" },
      assignedTo: { type: "string" },
      status: { type: "string" },
      priority: { type: "string" },
      comments: { type: "string" },
    },
    handler: async (request, reply) => {
      //getting the ID of the product Launch LIST

      let productLaunchListID = await DataBase.ProductLaunchLists.findOne({
        attributes: ["productLaunchListsID"],
        where: {
          productLaunchListsUUID: request.body.productListUUID,
          paused: false,
          deleted: false,
        },
      })
        .then((response) => {
          if (response) {
            return response;
          } else {
            return null;
          }
        })
        .catch((err) => {
          if (err) {
            console.log("Error Fetching Product Launch Details Status");
            console.trace(err);
            return null;
          }
        });
      //getting the product launch Status ID
      let productLaunchDetailsStatus =
        await DataBase.ProductLaunchDetailsStatus.findOne({
          attributes: ["productLaunchDetailsStatusID"],
          where: {
            productLaunchDetailsStatusUUID: request.body.status,
            paused: false,
            deleted: false,
          },
        })
          .then((response) => {
            if (response) {
              return response;
            } else {
              return null;
            }
          })
          .catch((err) => {
            if (err) {
              console.log("Error Fetching Product Launch Details Status");
              console.trace(err);
              return null;
            }
          });
      //getting the product launch Priority ID
      let productLaunchDetailsPriority =
        await DataBase.ProductLaunchDetailsPriority.findOne({
          attributes: ["productLaunchDetailsPriorityID"],
          where: {
            productLaunchDetailsPriorityUUID: request.body.priority,
            paused: false,
            deleted: false,
          },
        })
          .then((response) => {
            if (response) {
              return response;
            } else {
              return null;
            }
          })
          .catch((err) => {
            if (err) {
              console.log("Error Fetching Product Launch Details Priority");
              console.trace(err);
              return null;
            }
          });

      if (
        (productLaunchListID,
        productLaunchDetailsStatus,
        productLaunchDetailsPriority)
      ) {
        let createdTask = await DataBase.ProductLaunchDetails.create({
          productLaunchDetailsTitle: request.body.taskName,
          productLaunchDetailsDueDate: request.body.date,
          productLaunchDetailsAssigned: request.body.assignedTo,
          productLaunchDetailsComments: request.body.comments,
          productLaunchDetailsPriorityID:
            productLaunchDetailsPriority.dataValues
              .productLaunchDetailsPriorityID,
          productLaunchDetailsStatusID:
            productLaunchDetailsStatus.dataValues.productLaunchDetailsStatusID,
          productLaunchListsID:
            productLaunchListID.dataValues.productLaunchListsID,
          userID: request.body.userID,
        })
          .then((response) => {
            if (response) {
              return response;
            } else {
              return null;
            }
          })
          .catch((err) => {
            if (err) {
              console.log("Error Fetching Product Launch Details");
              console.trace(err);
              return err;
            }
          });
        if (createdTask) {
          return reply.code(200).send({ status: "Created", createdTask });
        }
      } else {
        return reply.code(500).send({
          status: "Error",
          message: "Can not get the Details",
        });
      }
    },
  });

  //PUT
  //Update the status, title and note of the supplier comparison page
  //creating a new  supplier comparison
  fastify.route({
    method: "PUT",
    url: "/updateProductLaunchDetails",
    logLevel: "warn",
    body: {
      productLaunchTrackerName: { type: "String" },
      productLaunchTrackerComment: { type: "String" },
      productLaunchUUID: { type: "String" },
    },
    handler: async (request, reply) => {
      //finding the comparison details
      let updateStatus = await DataBase.ProductLaunch.update(
        {
          productLaunchTitle: request.body.productLaunchTrackerName,
          productLaunchComments: request.body.productLaunchTrackerName,
        },
        {
          where: {
            productLaunchUUID: request.body.productLaunchUUID,
            paused: false,
            deleted: false,
          },
        }
      )
        .then((response) => {
          if (response) {
            return response;
          } else {
            return null;
          }
        })
        .catch((err) => {
          if (err) {
            console.log("Error Updating Product Launch Information");
            console.trace(err);
            return null;
          }
        });

      if (updateStatus) return reply.code(200).send({ status: "Updated" });
      else {
        console.log("Error Updating Product Launch Information");
        return reply.code(500).send("Error Please try Again");
      }
    },
  });

  //PUT
  // on editing the row
  fastify.route({
    method: "PUT",
    url: "/editProductLaunchDetails",
    logLevel: "warn",
    body: {
      assigned: { type: "String" },
      comments: { type: "String" },
      date: { type: "String" },
      priority: { type: "String" },
      status: { type: "String" },
      title: { type: "String" },
      uuid: { type: "String" },
    },
    handler: async (request, reply) => {
      //finding the comparison details

      let priorityInfo = await DataBase.ProductLaunchDetailsPriority.findOne({
        attributes: ["productLaunchDetailsPriorityID"],
        where: {
          productLaunchDetailsPriorityTitle: {
            [Sequelize.Op.like]: `%${request.body.priority}%`,
          },
        },
      })
        .then((response) => {
          if (response) {
            return response;
          } else {
            return null;
          }
        })
        .catch((err) => {
          if (err) {
            console.log("Error Finding Product Launch Priority");
            console.trace(err);
            return null;
          }
        });

      let statusInfo = await DataBase.ProductLaunchDetailsStatus.findOne({
        attributes: ["productLaunchDetailsStatusID"],
        where: {
          productLaunchDetailsTitle: {
            [Sequelize.Op.like]: `%${request.body.status}%`,
          },
        },
      })
        .then((response) => {
          if (response) {
            return response;
          } else {
            return null;
          }
        })
        .catch((err) => {
          if (err) {
            console.log("Error Finding Product Launch status");
            console.trace(err);
            return null;
          }
        });

      if ((statusInfo, priorityInfo)) {
        let updateStatus = await DataBase.ProductLaunchDetails.update(
          {
            productLaunchDetailsTitle: request.body.title,
            productLaunchDetailsDueDate: request.body.date,
            productLaunchDetailsAssigned: request.body.assigned,
            productLaunchDetailsComments: request.body.comments,
            productLaunchDetailsPriorityID:
              priorityInfo.dataValues.productLaunchDetailsPriorityID,
            productLaunchDetailsStatusID:
              statusInfo.dataValues.productLaunchDetailsStatusID,
          },
          {
            where: {
              productLaunchDetailsUUID: request.body.uuid,
              paused: false,
              deleted: false,
            },
          }
        )
          .then((response) => {
            if (response) {
              return response;
            } else {
              return null;
            }
          })
          .catch((err) => {
            if (err) {
              console.log("Error Updating Product Launch Information");
              console.trace(err);
              return null;
            }
          });

        if (updateStatus) return reply.code(200).send({ status: "Updated" });
        else {
          console.log("Error Updating Product Launch Information");
          return reply.code(500).send("Error Please try Again");
        }
      }
    },
  });

  //PUT
  //deleting the task row
  fastify.route({
    method: "PUT",
    url: "/deleteProductLaunchDetails",
    logLevel: "warn",
    body: {
      uuid: { type: "String" },
    },
    handler: async (request, reply) => {
      //finding the comparison details
      let updateStatus = await DataBase.ProductLaunchDetails.update(
        {
          deleted: 1,
        },
        {
          where: {
            productLaunchDetailsUUID: request.body.uuid,
            paused: false,
            deleted: false,
          },
        }
      )
        .then((response) => {
          if (response) {
            return response;
          } else {
            return null;
          }
        })
        .catch((err) => {
          if (err) {
            console.log("Error Updating Product Launch Information");
            console.trace(err);
            return null;
          }
        });

      if (updateStatus) return reply.code(200).send({ status: "Deleted" });
      else {
        console.log("Error Updating Product Launch Information");
        return reply.code(500).send("Error Please try Again");
      }
    },
  });
  //PUT
  //deleting the task row
  fastify.route({
    method: "PUT",
    url: "/checkedProductLaunchDetails",
    logLevel: "warn",
    body: {
      uuid: { type: "String" },
    },
    handler: async (request, reply) => {
      //finding the comparison details
      let updateStatus = await DataBase.ProductLaunchDetails.update(
        {
          productLaunchDetailsChecked: Sequelize.literal(
            "NOT productLaunchDetailsChecked"
          ),
        },
        {
          where: {
            productLaunchDetailsUUID: request.body.uuid,
            paused: false,
            deleted: false,
          },
        }
      )
        .then((response) => {
          if (response) {
            return response;
          } else {
            return null;
          }
        })
        .catch((err) => {
          if (err) {
            console.log("Error Updating Product Launch Information");
            console.trace(err);
            return null;
          }
        });

      if (updateStatus) return reply.code(200).send({ status: "Updated" });
      else {
        console.log("Error Updating Product Launch Information");
        return reply.code(500).send("Error Please try Again");
      }
    },
  });
}

// DataBase.ProductLaunchDetailsPriority.create({
//   productLaunchDetailsPriorityTitle: "Complete",
//   productLaunchDetailsPriorityColor: "#01BF80",
// });
