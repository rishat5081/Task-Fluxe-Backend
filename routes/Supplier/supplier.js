// our-first-route.js

const DataBase = require("../../DB_Sequelize/models"),
  { uploadSupplierFile } = require("../../Config/Multer/supplierFileUpload");

export async function supplierRoute(fastify, options) {
  // ------------------------------------  Start of Supplier Management Page ------------------------------------------------
  //post
  //adding a new supplier to the db
  fastify.post("/addSupplier", async (request, reply) => {
    //finding the company ID from the database using the received UUID

    let companies = await DataBase.company
      .findOne({
        attributes: ["companyID", "companyName", "companyUUID"],
        where: {
          companyUUID: request.body.companyUUID,
          paused: false,
          deleted: false,
        },
      })
      .catch((error) => {
        if (error) {
          console.error("Error in Finding Company for Creating New Supplier");
          console.trace(error);
          return null;
        }
      });
    if (companies === null) {
      return reply.code(200).send({
        status: "Company Does not Exists",
      });
    } else {
      let checkSupplier = await DataBase.Supplier.findOne({
        where: {
          supplierEmail: request.body.supplierEmail,
          userID: request.body.id,
        },
      })
        .then((response) => {
          if (response) return response;
          else return null;
        })
        .catch((error) => {
          if (error) {
            console.error(
              "Error in Finding Supplier Email for Creating New Supplier"
            );
            console.trace(error);
            return null;
          }
        });
      //checking if the email already exists or not...
      //if the email already exits then user will not be able create a new supplier
      // if the email is not in the database then the response will be undefined
      if (checkSupplier) {
        return reply.code(200).send({
          status: "Email Already Exists",
        });
      } else {
        //now creating a new supplier to the database...
        let supplier = await DataBase.Supplier.create({
          supplierName: request.body.supplierName,
          supplierEmail: request.body.supplierEmail,
          companyID: companies.dataValues.companyID,
          userID: request.body.id,
        })
          .then((response) => {
            if (response) return response;
          })
          .catch((error) => {
            if (error) {
              console.error("Error in Creating New Supplier");
              console.trace(error);
              return null;
            }
          });
        if (supplier === null) {
          return reply.code(500).send({ error: "Sorry! Please Try Again" });
        } else {
          return reply.code(201).send({
            status: "Successfully Supplier Created ",
            supplier,
            companies,
          });
        }
      }
    }
  });

  //PUT
  //updating the information of the supplier and company
  fastify.route({
    method: "PUT",
    url: "/updateCompanySupplierInfo",
    logLevel: "warn",
    body: {
      // request needs to have a querystring with a `name` parameter
      type: "object",
      properties: {
        companyUUID: { type: "string" },
        supplierUUID: { type: "string" },
        companyAddress: { type: "string" },
        companyPhone: { type: "number" },
        companyWebsite: { type: "string" },
        supplierEmail: { type: "string" },
        supplierName: { type: "string" },
        supplierPhone: { type: "number" },
        supplierPosition: { type: "number" },
        id: { type: "number" },
      },
    },
    handler: async (request, reply) => {
      if (request.body) {
        let companySupplierInfo = await DataBase.company
          .findOne({
            where: {
              companyUUID: request.body.companyUUID,
              paused: false,
              deleted: false,
            },
            include: {
              model: DataBase.Supplier,
              required: true,
              where: {
                supplierUUID: request.body.supplierUUID,
                userID: request.body.id,
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

        //checking if the supplier and company exists in the database or not
        if (companySupplierInfo === null) {
          return reply
            .code(400)
            .send({ message: "Please provide correct information" });
        } else {
          //updating the company
          let updateCompany = await DataBase.company
            .update(
              {
                companyAddress: request.body.companyAddress,
                companyPhone: request.body.companyPhone,
                companyWeb: request.body.companyWeb,
              },
              {
                where: {
                  companyUUID: request.body.companyUUID,
                  userID: request.body.id,
                  paused: false,
                  deleted: false,
                },
              }
            )
            .then((result) => {
              if (result) return result;
              else return null;
            })
            .catch((err) => {
              if (err) {
                console.error("Error Company");
                console.trace(err);
                return null;
              }
            });

          //updating the supplier
          let updateSupplier = await DataBase.Supplier.update(
            {
              supplierEmail: request.body.supplierEmail,
              supplierName: request.body.supplierName,
              supplierPhone: request.body.supplierPhone,
              supplierPosition: request.body.supplierPosition,
            },
            {
              where: {
                supplierUUID: request.body.supplierUUID,
                userID: request.body.id,
                paused: false,
                deleted: false,
              },
            }
          )
            .then((result) => {
              if (result) return result;
              else return null;
            })
            .catch((err) => {
              if (err) {
                console.error("Error Supplier");
                console.trace(err);
                return null;
              }
            });

          if (updateCompany && updateSupplier) {
            return reply.code(200).send({
              message: "Successfully Updated",
            });
          } else {
            console.trace("Error Updating ");
            return reply.code(200).send({
              message: "Please try Again",
            });
          }
        }
      }
      return reply;
    },
  });

  //PUT
  //adding  the product to the supplier
  fastify.route({
    method: "PUT",
    url: "/addProductToSupplier",
    logLevel: "error",
    body: {
      // request needs to have a querystring with a `name` parameter
      supplierUUID: { type: "string" },
      type: "object",
      properties: {
        value: { type: "string" },
        label: { type: "string" },
      },
      id: { type: "string" },
    },
    handler: async (request, reply) => {
      if (request.body) {
        let supplierInfo = await DataBase.Supplier.findOne({
          where: {
            supplierUUID: request.body.supplierUUID,
            userID: request.body.id,
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

        let productDetails = await DataBase.Product.findAll({
          where: {
            productUUID: request.body.productList.map(
              (product) => product.value
            ),
            userID: request.body.id,
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
        // console.log(productDetails);

        if ((productDetails, supplierInfo)) {
          console.log(productDetails, supplierInfo);
          const status = await DataBase.Supplier_Product_Associate.bulkCreate(
            productDetails.map((product) => ({
              supplierID: supplierInfo.supplierID,
              productID: product.productID,
            }))
          );
          if (status) {
            reply.code(200).send("Successfully Added", status);
          } else {
            console.log("Error Adding Products to Suuplier");
            console.trace("Error Adding Products to Suuplier");
            reply.send("kadbskdjb", status);
          }
        } else {
          console.log("Error Fetching Products to Suuplier");
          console.trace("Error Fetching Products to Suuplier");
          reply.code(500).send("Error Please try Again");
        }
      }
      return reply;
    },
  });

  //PUT
  //adding  the product to the supplier
  fastify.route({
    method: "PUT",
    url: "/addNoteToSupplier",
    logLevel: "warn",
    body: {
      // request needs to have a querystring with a `name` parameter
      supplierUUID: { type: "string" },
      note: { type: "string" },
      id: { type: "string" },
    },
    handler: async (request, reply) => {
      if (request.body) {
        let supplierInfo = await DataBase.Supplier.findOne({
          where: {
            supplierUUID: request.body.supplierUUID,
            userID: request.body.id,
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

        if (supplierInfo) {
          const status = await DataBase.Supplier.update(
            {
              supplierNote: request.body.note,
            },
            {
              where: {
                supplierUUID: request.body.supplierUUID,
                userID: request.body.id,
                paused: false,
                deleted: false,
              },
            }
          );
          if (status) {
            reply.code(200).send("Note Added Successfully");
          } else {
            console.log("Error Adding Note to Suuplier");
            console.trace("Error Adding Note to Suuplier");
            reply.code(500).send("Error", status);
          }
        } else {
          console.log("Error Fetching Products to Suuplier");
          console.trace("Error Fetching Products to Suuplier");
          reply.code(500).send("Error Please try Again");
        }
      }
      return reply;
    },
  });

  // post route for uploading the company image
  fastify.post("/uploadSupplierFiles", async (request, reply) => {
    uploadSupplierFile(request, reply, async (err) => {
      if (err) {
        console.log(err.message);
        return reply.code(200).send({ messages: err.message, type: "danger" });
      } else {
        var filePath = request.files[0].destination.split("/public")[1];

        let supplerInfo = await DataBase.Supplier.findOne({
          attributes: ["companyID", "supplierID"],
          where: {
            supplierUUID: request.body.supplierUUID,
            userID: request.body.id,
            paused: false,
            deleted: false,
          },
        });
        if (supplerInfo) {
          DataBase.SupplierFiles.create({
            fileTitle: request.files[0].filename,
            filePath: filePath + "/" + request.files[0].filename,
            companyID: supplerInfo.dataValues.companyID,
            supplierID: supplerInfo.dataValues.supplierID,
          })
            .then((result) => {
              if (result) {
                return reply.code(200).send({
                  messages: "Done",
                  fileTitle: request.files[0].filename,
                  filePath: filePath + "/" + request.files[0].filename,
                });
              }
            })
            .catch((err) => {
              console.log(err);
              if (err) {
                return reply.code(500).send({
                  messages: "Please Try Again",
                  type: "error",
                });
              }
            });
        } else {
          return reply.code(200).send({
            messages: "No User Found",
            type: "error",
          });
        }
      }
    });
    return reply;
  });

  // ------------------------------------ End of Supplier Management Page ------------------------------------------------
  /**
   *
   *
   *
   *
   *
   *
   */

  // ------------------------------------  Start of Invoice Management Page ------------------------------------------------
  //GET
  //getting all supplier names and uuid for create a new invoice

  fastify.route({
    method: "GET",
    url: "/getAllSupplierNames",
    logLevel: "error",
    handler: async (request, reply) => {
      let supplierInfo = await DataBase.Supplier.findAll({
        attributes: ["supplierUUID", "supplierName"],
        include: {
          model: DataBase.Product,
          required: false,
          attributes: ["productName", "productUUID"],
          through: {
            attributes: [],
            where: {
              paused: false,
              deleted: false,
            },
          },
          where: {
            paused: false,
            deleted: false,
          },
        },
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

      let InvoiceStatus = await DataBase.InvoiceStatus.findAll({
        attributes: ["invoiceStatusUUID", "invoiceTitle", "invoiceStatusColor"],
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

      if ((supplierInfo, InvoiceStatus)) {
        return reply.code(200).send({ supplierInfo, InvoiceStatus });
      } else {
        console.log("Error Fetching Products to Suuplier");
        console.trace("Error Fetching Products to Suuplier");
        return reply.code(500).send("Error Please try Again");
      }
    },
  });
}

// module.exports = companyRoute;

// DataBase.InvoiceStatus.create({
//   invoiceTitle: "Waiting",
//   invoiceStatusColor: "#e1d43f",
// }).then((res) => {
//   console.log(res);
// });
