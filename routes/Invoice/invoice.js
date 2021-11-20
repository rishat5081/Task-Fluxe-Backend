// our-first-route.js

const DataBase = require("../../DB_Sequelize/models"),
  { uploadInvoicesFile } = require("../../Config/Multer/inoviceFileUpload"),
  { unlink } = require("fs/promises"),
  Sequelize = require("sequelize"),
  router = require("express").Router();

/***
 *
 *
 *
 *
 *
 */
// ------------------------------------  Start of Invoice Management Page ------------------------------------------------

//GET
// getting all invoice details related to the supplier info and also the invoice details
// getting the products and status for creating form too...

router.route("/getAllInvoices").get(async (request, reply) => {
  let invoiceInfo = await DataBase.Invoice.findAll({
    attributes: [
      "invoiceID",
      "invoiceUUID",
      "invoiceTitle",
      "invoiceTotal",
      "invoicePaid",
      "invoiceOutStanding",
      "invoiceFileTitle",
      "invoiceFile",
      "invoiceNotes",
      "invoiceDueDate",
    ],
    include: [
      {
        model: DataBase.Product,
        required: false,
        attributes: ["productName", "productUUID"],
        where: {
          userID: request.query.id,
          paused: false,
          deleted: false,
        },
      },
      {
        model: DataBase.Supplier,
        required: false,
        attributes: ["supplierUUID", "supplierName"],
        where: {
          userID: request.query.id,
          paused: false,
          deleted: false,
        },
      },
      {
        model: DataBase.InvoiceStatus,
        required: false,
        attributes: [
          "invoiceStatusUUID",
          "invoiceStatusTitle",
          "invoiceStatusColor",
        ],
        where: {
          paused: false,
          deleted: false,
        },
      },
    ],
    where: {
      userID: request.query.id,
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

  if (invoiceInfo) {
    reply.status(200).send({ invoiceInfo });
    reply.end();
    return;
  } else {
    console.log("Error Fetching Products to Suuplier");
    console.trace("Error Fetching Products to Suuplier");
    reply.status(500).send("Error Please try Again");
    reply.end();
    return;
  }
});

//GET
//getting all supplier names and uuid for create a new invoice
// getting the products and status for creating form too...

router.route("/getAllSupplierNames").get(async (request, reply) => {
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
        userID: request.query.userID,
        paused: false,
        deleted: false,
      },
    },
    where: {
      userID: request.query.userID,
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
    attributes: [
      "invoiceStatusUUID",
      "invoiceStatusTitle",
      "invoiceStatusColor",
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
        return null;
      }
    });

  if ((supplierInfo, InvoiceStatus)) {
    reply.status(200).send({ supplierInfo, InvoiceStatus });
    reply.end();
    return;
  } else {
    console.log("Error Fetching Products to Suuplier");
    console.trace("Error Fetching Products to Suuplier");
    reply.status(500).send("Error Please try Again");
    reply.end();
    return;
  }
});

//POST
//creating an invoice for the supplier and also add the product, upload file and create a new invoice
router.route("/createInvoice").post(async (request, reply) => {
  uploadInvoicesFile(request, reply, async (err) => {
    if (err) console.log(err);
    else {
      //getting the supplier Info
      let supplierDetails = await DataBase.Supplier.findOne({
        attributes: ["supplierID"],
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

      //getting the product info
      let productInfo = await DataBase.Product.findOne({
        attributes: ["productID"],
        where: {
          productUUID: request.body.productUUID,
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

      //getting the status of invoice ID info
      let invoiceStatusInfo = await DataBase.InvoiceStatus.findOne({
        attributes: ["invoiceStatusID"],
        where: {
          invoiceStatusUUID: request.body.invoiceStatus,
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

      if ((productInfo, supplierDetails, invoiceStatusInfo)) {
        //getting the file name and destination
        var filePath = request.files[0].destination.split("/public")[1];

        /**
         * creating a new invoice
         */
        DataBase.Invoice.create({
          invoiceTitle: request.body.invoice_Title,
          invoiceTotal: +request.body.invoiceTotal,
          invoicePaid: +request.body.invoicePaid,
          invoiceOutStanding: Sequelize.literal(
            +request.body.invoiceTotal - +request.body.invoicePaid
          ),
          invoiceDueDate: request.body.DueDate,
          invoiceFileTitle: request.files[0].filename,
          invoiceFile: filePath + "/" + request.files[0].filename,
          invoiceStatusID: invoiceStatusInfo.dataValues.invoiceStatusID,
          productID: productInfo.dataValues.productID,
          supplierID: supplierDetails.dataValues.supplierID,
          userID: request.body.id,
        })
          .then((response) => {
            if (response) {
              reply.status(200).send({
                status: "Created",
                message: "Invoice Created Successfully",
              });
              reply.end();
              return;
            } else {
              return null;
            }
          })
          .catch((err) => {
            if (err) {
              console.log("Error Creating a new Invoice");
              console.trace("Error Creating a new Invoice");
              reply.status(500).send("Error Please try Again");
              reply.end();
              return;
            }
          });
      }
    }
  });
});

//getting the selected invoice details for the drawer
router.route("/getSelectedInvoice").get(async (request, reply) => {
  let invoiceDetails = await DataBase.Invoice.findOne({
    attributes: [
      "invoiceID",
      "invoiceUUID",
      "invoiceTitle",
      "invoiceTotal",
      "invoicePaid",
      "invoiceOutStanding",
      "invoiceFileTitle",
      "invoiceFile",
      "invoiceNotes",
      "invoiceDueDate",
      "supplierID",
      "productID",
      "invoiceStatusID",
    ],
    include: [
      {
        model: DataBase.Product,
        required: true,
        attributes: ["productName", "productUUID"],
        where: {
          paused: false,
          deleted: false,
        },
      },
      {
        model: DataBase.Supplier,
        required: true,
        attributes: ["supplierUUID", "supplierName"],
        where: {
          paused: false,
          deleted: false,
        },
      },
      {
        model: DataBase.InvoiceStatus,
        required: true,
        attributes: ["invoiceStatusUUID", "invoiceStatusTitle"],
        where: {
          paused: false,
          deleted: false,
        },
      },
    ],
    where: {
      paused: false,
      deleted: false,
      invoiceUUID: request.query.invoiceUUID,
    },
  }).catch((err) => {
    if (err) {
      console.error("Error Getting invoice details");
      console.trace(err);
      return null;
    }
  });

  let allSupplier = await DataBase.Supplier.findAll({
    attributes: ["supplierUUID", "supplierName"],
    where: {
      supplierID: {
        [Sequelize.Op.ne]: invoiceDetails.dataValues.supplierID,
      },
      paused: false,
      deleted: false,
    },
  }).catch((err) => {
    if (err) {
      console.error("Error Getting Supplier details");
      console.trace(err);
      return null;
    }
  });
  let allProducts = await DataBase.Product.findAll({
    attributes: ["productName", "productUUID"],
    where: {
      productID: {
        [Sequelize.Op.ne]: invoiceDetails.dataValues.productID,
      },
      paused: false,
      deleted: false,
    },
  }).catch((err) => {
    if (err) {
      console.error("Error Getting Product details");
      console.trace(err);
      return null;
    }
  });
  let allStatus = await DataBase.InvoiceStatus.findAll({
    attributes: ["invoiceStatusUUID", "invoiceStatusTitle"],
    where: {
      invoiceStatusID: {
        [Sequelize.Op.ne]: invoiceDetails.dataValues.invoiceStatusID,
      },
      paused: false,
      deleted: false,
    },
  }).catch((err) => {
    if (err) {
      console.error("Error Getting InvoiceStatus details");
      console.trace(err);
      return null;
    }
  });

  if ((invoiceDetails, allSupplier, allProducts, allStatus)) {
    reply.status(200).send({
      status: "Found",
      invoiceDetails,
      allSupplier,
      allProducts,
      allStatus,
    });
    reply.end();
    return;
  } else {
    console.error("Error in Getting a Invoice Detail");
    reply.status(200).send({
      status: "Found",
      invoiceDetails,
      allSupplier,
      allProducts,
      allStatus,
    });
    reply.end();
    return;
  }
});

//updating the invoice

//PUT
//adding  the product to the supplier
router.route("/updateInvoice").put(async (request, reply) => {
  if (request.body) {
    //getting supplier ID
    let supplierInfo = await DataBase.Supplier.findOne({
      attributes: ["supplierID"],
      where: {
        supplierUUID: request.body.supplierUUID,
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
          console.error("Error Getting Supplier details");
          console.trace(err);
          return null;
        }
      });

    //getting product ID
    let productInfo = await DataBase.Product.findOne({
      attributes: ["productID"],
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
          console.error("Error Getting Product details");
          console.trace(err);
          return null;
        }
      });

    //getting status ID
    let statusInfo = await DataBase.InvoiceStatus.findOne({
      attributes: ["invoiceStatusID"],
      where: {
        invoiceStatusUUID: request.body.statusUUID,
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
          console.error("Error Getting Invoice Status details");
          console.trace(err);
          return null;
        }
      });

    if ((statusInfo, productInfo, supplierInfo)) {
      let invoiceUpdate = await DataBase.Invoice.update(
        {
          invoiceTitle: request.body.invoiceTitle,
          invoiceTotal: request.body.invoiceTotal,
          invoicePaid: request.body.invoicePaid,
          invoiceNotes: request.body.invoiceNotes,
          invoiceDueDate: request.body.invoiceDate,
          productID: productInfo.dataValues.productID,
          supplierID: supplierInfo.dataValues.supplierID,
          invoiceStatusID: statusInfo.dataValues.invoiceStatusID,
          invoiceOutStanding: Sequelize.literal(
            +request.body.invoiceTotal - +request.body.invoicePaid
          ),
        },
        {
          where: {
            paused: false,
            deleted: false,
            invoiceUUID: request.body.invoiceUUID,
          },
        }
      ).catch((err) => {
        if (err) {
          console.error("Error Updating Invoice details");
          console.trace(err);
        }
      });

      if (invoiceUpdate) {
        reply.status(200).send("Successfully Updated");
        reply.end();
        return;
      } else {
        reply.status(500).send("Error Please try Again");
        reply.end();
        return;
      }
    }
  }
});

//PUT
//updating the invoice file
// post route for uploading the company image
router.route("/updateInvoiceAttachment").put(async (request, reply) => {
  console.log(request.body);
  //getting the file path and file name to delete the previous file and upload the new file

  uploadInvoicesFile(request, reply, async (err) => {
    if (err) {
      console.log(err.message);
      return reply.status(200).send({ messages: err.message, type: "danger" });
    } else {
      let invoiceFile = await DataBase.Invoice.findOne({
        attributes: ["invoiceFileTitle", "invoiceFile"],
        where: {
          paused: false,
          deleted: false,
          invoiceUUID: request.body.invoiceUUID,
        },
      });

      if (invoiceFile.dataValues.invoiceFileTitle)
        await unlink(
          `../taskFluxe/public${invoiceFile.dataValues.invoiceFile}`
        );
      var filePath = request.files[0].destination.split("/public")[1];

      DataBase.Invoice.update(
        {
          invoiceFile: filePath + "/" + request.files[0].filename,
          invoiceFileTitle: request.files[0].filename,
        },
        {
          where: {
            invoiceUUID: request.body.invoiceUUID,
          },
        }
      )
        .then((result) => {
          if (result) {
            reply.status(200).send({
              messages: "Done",
              filePath: filePath + "/" + request.files[0].filename,
              fileName: request.files[0].filename,
            });
            reply.end();
            return;
          }
        })
        .catch((err) => {
          console.log(err);
          if (err) {
            reply.status(500).send({
              messages: "Please Try Again",
              type: "error",
            });
            reply.end();
            return;
          }
        });
    }
  });
});

//PUT
//deleting the invoice file
router.route("/deleteInvoiceAttachment").put(async (request, reply) => {
  if (request.body) {
    let invoiceUpdate = await DataBase.Invoice.update(
      {
        invoiceFileTitle: null,
        invoiceFile: null,
      },
      {
        where: {
          paused: false,
          deleted: false,
          invoiceUUID: request.body.invoiceUUID,
        },
      }
    ).catch((err) => {
      if (err) {
        console.error("Error Updating Invoice details");
        console.trace(err);
        return null;
      }
    });

    if (invoiceUpdate) {
      reply.status(200).send({
        status: "success",
        message: "Successfully Deleted",
        invoiceUpdate,
      });
      reply.end();
      return;
    } else {
      reply.status(500).send({
        status: "error",
        message: "Error Please try Again",
        invoiceUpdate,
      });
      reply.end();
      return;
    }
  }
});
module.exports = router;
