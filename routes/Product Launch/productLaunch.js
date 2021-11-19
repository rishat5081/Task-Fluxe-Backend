const DataBase = require("../../DB_Sequelize/models"),
  Sequelize = require("sequelize"),
  router = require("express").Router();

//GET
//getting all the product launch and status for the main page table
router.route("/getProductLaunchList").get(async (request, reply) => {
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
    reply.status(200).send({ productList });
    reply.end();
    return;
  } else {
    console.log("Error Fetching all Product Names");
    console.trace("Error Fetching all Product Names");
    reply.status(500).send("Error Please try Again");
    reply.end();
    return;
  }
});

//get
//getting all product names for the adding a new product launch from the existing products
router.route("/getProductNames").get(async (request, reply) => {
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
    reply.status(200).send({ productList });
    reply.end();
    return;
  } else {
    console.log("Error Fetching all Product Names");
    console.trace("Error Fetching all Product Names");
    reply.status(500).send("Error Please try Again");
    reply.end();
    return;
  }
});
//POST
//getting all product names for the adding a new product launch from the existing products
router.route("/addExistingProducttoLanch").post(async (request, reply) => {
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
          reply.status(200).send({ result, status: "Created" });
          reply.end();
          return;
        }
      })
      .catch((err) => {
        if (err) {
          console.log("Error Creating  Product Launch");
          console.trace(err);
          reply.status(500).send("Error Please try Again");
          reply.end();
          return;
        }
      });
  } else {
    console.log("Error Creating  Product Launch");
    console.trace("Error Creating  Product Launch");
    reply.status(500).send("Error Please try Again");
    reply.end();
    return;
  }
});
//POST
//creating a new product launch from the existing products
router.route("/addNewProducttoLaunch").post(async (request, reply) => {
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
          reply.status(200).send({ result, status: "Created" });
          reply.end();
          return;
        }
      })
      .catch((err) => {
        if (err) {
          console.log("Error Creating  Product Launch");
          console.trace(err);
          reply.status(500).send("Error Please try Again");
          reply.end();
          return;
        }
      });
  } else {
    console.log("Error Creating  Product Launch");
    console.trace("Error Creating  Product Launch");
    reply.status(500).send("Error Please try Again");
    reply.end();
    return;
  }
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
router.route("/createNewTaskList").post(async (request, reply) => {
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
    if (createdStatus) {
      reply.status(200).send({ result: createdStatus, status: "Created" });
      reply.end();
      return;
    } else {
      console.log("Error Creating  Product Launch");
      console.trace(err);
      reply.status(500).send("Error Please try Again");
      reply.end();
      return;
    }
  } else {
    console.log("Error Creating  Product Launch");
    console.trace("Error Creating  Product Launch");
    reply.status(500).send("Error Please try Again");
    reply.end();
    return;
  }
});

//GET
//Query Parameter
router.route("/getProductLaunchDetails").get(async (request, reply) => {
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
      reply.status(200).send({
        productLaunchTaskLists,
        productLaunchDetails,
      });
      reply.end();
      return;
    }
  } else {
    reply.status(500).send({
      status: "Error",
      message: "Can not get the Details",
    });
    reply.end();
    return;
  }
});

//Get
//getting the status and priority
router.route("/getPriorityAndStatus").get(async (request, reply) => {
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
    reply.status(200).send({
      productLaunchDetailsPriority,
      productLaunchDetailsStatus,
    });
    reply.end();
    return;
  } else {
    reply.status(500).send({
      status: "Error",
      message: "Can not get the Details",
    });
    reply.end();
    return;
  }
});

//Post
//Create New Task
router.route("/addNewTask").post(async (request, reply) => {
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
        productLaunchDetailsPriority.dataValues.productLaunchDetailsPriorityID,
      productLaunchDetailsStatusID:
        productLaunchDetailsStatus.dataValues.productLaunchDetailsStatusID,
      productLaunchListsID: productLaunchListID.dataValues.productLaunchListsID,
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
      reply.status(200).send({ status: "Created", createdTask });
      reply.end();
      return;
    }
  } else {
    reply.status(500).send({
      status: "Error",
      message: "Can not get the Details",
    });
    reply.end();
    return;
  }
});

//PUT
//Update the status, title and note of the supplier comparison page
//creating a new  supplier comparison
router.route("/updateProductLaunchDetails").put(async (request, reply) => {
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

  if (updateStatus) {
    reply.status(200).send({ status: "Updated" });
    reply.end();
    return;
  } else {
    console.log("Error Updating Product Launch Information");
    reply.status(500).send("Error Please try Again");
    reply.end();
    return;
  }
});

//PUT
// on editing the row
router.route("/editProductLaunchDetails").put(async (request, reply) => {
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

    if (updateStatus) {
      reply.status(200).send({ status: "Updated" });
      reply.end();
      return;
    } else {
      console.log("Error Updating Product Launch Information");
      reply.status(500).send("Error Please try Again");
      reply.end();
      return;
    }
  }
});

//PUT
//deleting the task row
router.route("/deleteProductLaunchDetails").put(async (request, reply) => {
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

  if (updateStatus) {
    reply.status(200).send({ status: "Deleted" });
    reply.end();
    return;
  } else {
    console.log("Error Updating Product Launch Information");
    reply.status(500).send("Error Please try Again");
    reply.end();
    return;
  }
});
//PUT
//deleting the task row
router.route("/checkedProductLaunchDetails").put(async (request, reply) => {
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

  if (updateStatus) {
    reply.status(200).send({ status: "Updated" });
    reply.end();
    return;
  } else {
    console.log("Error Updating Product Launch Information");
    reply.status(500).send("Error Please try Again");
    reply.end();
    return;
  }
});

module.exports = router;
// DataBase.ProductLaunchDetailsPriority.create({
//   productLaunchDetailsPriorityTitle: "Complete",
//   productLaunchDetailsPriorityColor: "#01BF80",
// });
