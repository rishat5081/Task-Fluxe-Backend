const DataBase = require("../../DB_Sequelize/models"),
  Sequelize = require("sequelize"),
  router = require("express").Router();

//GET
//all the comparisons name and status
router.route("/getAllComparisons").get(async (request, reply) => {
  let comparisonList = await DataBase.Comparison.findAll({
    attributes: ["comparisonUUID", "comparisonTitle", "comparisonRatingID"],
    where: {
      userID: request.query.id,
      paused: false,
      deleted: false,
    },
    include: {
      model: DataBase.ComparisonRating,
      required: false,
      attributes: ["title", "color"],
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

  if (comparisonList) {
    reply.status(200).send({ comparisonList });
    reply.end();
    return;
  } else {
    console.log("Error Fetching all Supplier Comparison");
    console.trace("Error Fetching all Supplier Comparison");
    reply.status(500).send("Error Please try Again");
    reply.end();
    return;
  }
});

//POST
//creating a new  supplier comparison
router.route("/addNewSupplierComp").post(async (request, reply) => {
  let productList = await DataBase.Comparison.create({
    comparisonTitle: request.body.productName,
    userID: 1,
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
        console.log("Error Creating new Supplier Comparison");
        console.trace(err);
        return null;
      }
    });

  if (productList) {
    reply.status(200).send({ productList });
    reply.end();
    return;
  } else {
    console.log("Error Creating new Supplier Comparison");
    console.trace("Error Creating new Supplier Comparison");
    reply.status(500).send("Error Please try Again");
    reply.end();
    return;
  }
});

//GET
//all the comparisons name and status

router.route("/getComparisonDetails").get(async (request, reply) => {
  let comparisonDetails = await DataBase.Comparison.findOne({
    attributes: [
      "comparisonUUID",
      "comparisonTitle",
      "comparisonDescription",
      "comparisonRatingID",
    ],
    where: {
      comparisonUUID: request.query.comparisonUUID,
      paused: false,
      deleted: false,
    },
    include: [
      {
        model: DataBase.ComparisonRating,
        required: false,
        attributes: ["title", "color", "comparisonRatingUUID"],
        where: {
          paused: false,
          deleted: false,
        },
      },
      {
        model: DataBase.ComparisonDetails,
        required: false,
        attributes: {
          exclude: [
            "comparisonDetailsID",
            "comparisonDetailsUUID",
            "paused",
            "deleted",
            "createdAt",
            "updatedAt",
          ],
        },
        include: {
          model: DataBase.ComparisonSupplierRating,
          required: false,
          attributes: ["title", "color"],
        },
        where: {
          paused: false,
          deleted: false,
        },
      },
    ],
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

  //getting all the rating from the DB
  let allRatings = await DataBase.ComparisonRating.findAll({
    attributes: ["title", "color", "comparisonRatingUUID"],
    where: {
      paused: false,
      deleted: false,
      comparisonRatingID: {
        [Sequelize.Op.ne]: comparisonDetails.dataValues.comparisonRatingID,
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
        console.log("Error Fetching all Ratings");
        console.trace(err);
        return null;
      }
    });

  if ((comparisonDetails, allRatings)) {
    reply.status(200).send({ comparisonDetails, allRatings });
    reply.end();
    return;
  } else {
    console.log("Error Fetching all Supplier Comparison");
    console.trace("Error Fetching all Supplier Comparison");
    reply.status(500).send("Error Please try Again");
    reply.end();
    return;
  }
});

//PUT
//Update the status, title and note of the supplier comparison page
//creating a new  supplier comparison
router.route("/updateComparisonDetails").put(async (request, reply) => {
  //finding the comparison details
  let comparisonList = await DataBase.Comparison.findOne({
    where: {
      comparisonUUID: request.body.comparisonUUID,
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
        console.log("Error Fetching new Supplier Comparison Information");
        console.trace(err);
        return null;
      }
    });
  //finding the status
  let comparisonRating = await DataBase.ComparisonRating.findOne({
    attributes: ["comparisonRatingID"],
    where: {
      comparisonRatingUUID: request.body.comparisonStatus,
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
        console.log("Error Fetching new Supplier Comparison Rating");
        console.trace(err);
        return null;
      }
    });

  if ((comparisonRating, comparisonList)) {
    DataBase.Comparison.update(
      {
        comparisonTitle: request.body.compTitle,
        comparisonDescription: request.body.comparisonDescription,
        comparisonRatingID: comparisonRating.dataValues.comparisonRatingID,
      },
      {
        where: {
          comparisonUUID: request.body.comparisonUUID,
          paused: false,
          deleted: false,
        },
      }
    )
      .then((response) => {
        if (response) {
          reply.status(200).send({ status: "Updated" });
          reply.end();
          return;
        } else {
          return null;
        }
      })
      .catch((err) => {
        if (err) {
          console.log("Error Updating new Supplier Comparison Information");
          console.trace(err);
          reply.status(500).send("Error Please try Again");
          reply.end();
          return;
        }
      });
  } else {
    reply.status(500).send("Error Please try Again");
    reply.end();
    return;
  }
});

//GET
//all the rating of the supplier comparisons
router.route("/getAllRating").get(async (request, reply) => {
  let ratingList = await DataBase.ComparisonSupplierRating.findAll({
    attributes: ["comparisonSupplierRatingUUID", "title", "color"],
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
        console.log("Error Fetching all Rating of Supplier Comparison");
        console.trace(err);
        return null;
      }
    });

  if (ratingList) {
    reply.status(200).send({ ratingList });
    reply.end();
    return;
  } else {
    console.log("Error Fetching all Rating of Supplier Comparison");
    console.trace("Error Fetching all Rating of Supplier Comparison");
    reply.status(500).send("Error Please try Again");
    reply.end();
    return;
  }
});
//POST
//creating a new  product comparison for comparison
router.route("/addNewSupplierforComparison").post(async (request, reply) => {
  //getting the comparison id
  let dbComparison = await DataBase.Comparison.findOne({
    attributes: ["comparisonID"],
    where: {
      comparisonUUID: request.body.comparisonUUID,
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
        console.log("Error Getting Supplier Comparison ID");
        console.trace(err);
        return null;
      }
    });
  //getting the comparison rating id
  let dbComparisonRating = await DataBase.ComparisonSupplierRating.findOne({
    attributes: ["comparisonSupplierRatingID"],
    where: {
      comparisonSupplierRatingUUID: request.body.rating,
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
        console.log("Error Getting Comparison Supplier Rating ID");
        console.trace(err);
        return null;
      }
    });

  if ((dbComparison, dbComparisonRating)) {
    console.log(request.body);
    await DataBase.ComparisonDetails.create({
      comparisonID: dbComparison.dataValues.comparisonID,
      comparisonSupplierRatingID:
        dbComparisonRating.dataValues.comparisonSupplierRatingID,
      companyName: request.body.companyName,
      website: request.body.website,
      email: request.body.email,
      productCost: request.body.productCost,
      productShippingCost: request.body.productShippingCost,
      productOtherCost: request.body.productOtherCost,
      productTotalCost: request.body.productTotalCost,
      productSalePrice: request.body.productSalePrice,
      productExpectedRevenue: request.body.productExpectedRevenue,
      packagingOption: request.body.packagingOption,
      leadTime: request.body.leadTime,
      sampleInformation: request.body.sampleInformation,
      comments: request.body.comments,
      userID: request.body.userID,
    })
      .then((response) => {
        if (response) {
          reply.status(200).send("Created Successfully");
          reply.end();
          return;
        } else {
          return null;
        }
      })
      .catch((err) => {
        if (err) {
          console.log("Error Creating new Supplier Comparison");
          console.trace(err);
          reply.status(500).send("Error Creating new Supplier Comparison");
          reply.end();
          return;
        }
      });
  } else {
    console.log("Error Creating new Supplier Comparison");
    console.trace("Error Creating new Supplier Comparison");
    reply.status(500).send("Error Please try Again");
    reply.end();
    return;
  }
});

module.exports = router;

// DataBase.ComparisonSupplierRating.create({
//   title: "No",
//   color: "#bf0101",
// })
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((err) => {});
