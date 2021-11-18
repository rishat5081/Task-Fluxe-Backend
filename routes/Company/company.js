// our-first-route.js
const DataBase = require("../../DB_Sequelize/Sequelize/index.js"),
  { uploadCompanyImages } = require("../../Config/Multer/imageUpload"),
  router = require("express").Router();

// getting data of the supplier dashboard
router.get("/getDashboard", async (request, reply) => {
  //getting all the companies along with the supplier name and record
  let companies = await DataBase.company.findAll({
    attributes: ["companyUUID", "companyName"],
    include: [
      {
        model: DataBase.Supplier,
        attributes: ["supplierUUID", "supplierName", "supplierEmail"],
        required: true,
        where: {
          userID: request.query.id,
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
  });
  reply.status(200).send({
    companies,
  });
  reply.end();
});

//getting the names of the registered companies for adding a new supplier
router.get("/getNames", async (request, reply) => {
  let companies = await DataBase.company.findAll({
    attributes: ["companyUUID", "companyName"],
    where: {
      paused: false,
      deleted: false,
    },
  });
  reply.status(200).send({
    companies,
  });
  reply.end();
});

//here we are getting the information of the company and supplier for the supplier management drawer

router.route("/getCompany_SupplierInformation").get(async (request, reply) => {
  if (request.query) {
    //getting all the companies along with the supplier name and record
    let companies = await DataBase.company.findOne({
      attributes: [
        "companyUUID",
        "companyName",
        "companyWeb",
        "companyPhone",
        "companyAddress",
        "companyLogo",
      ],
      include: [
        {
          model: DataBase.Supplier,
          attributes: [
            "supplierUUID",
            "supplierName",
            "supplierEmail",
            "supplierPhone",
            "supplierPosition",
            "supplierNote",
          ],
          required: true,
          include: [
            {
              model: DataBase.Product,
              attributes: ["productName"],
              //required false make the left outer join
              required: false,
              through: {
                attributes: [],
              },
              where: {
                paused: false,
                deleted: false,
              },
            },
            {
              model: DataBase.SupplierFiles,
              attributes: ["fileTitle", "filePath"],
              //required false make the left outer join
              required: false,
              where: {
                paused: false,
                deleted: false,
              },
            },
          ],
          where: {
            supplierUUID: request.query.supplierUUID,
            userID: request.query.id,
            paused: false,
            deleted: false,
          },
        },
        {
          model: DataBase.Product,
          attributes: ["productUUID", "productName"],
          //required false make the left outer join
          required: false,
          where: {
            paused: false,
            deleted: false,
          },
        },
      ],
      where: {
        companyUUID: request.query.companyUUID,
        paused: false,
        deleted: false,
      },
    });
    //gettting the products of the company

    //checking if the results are found or not
    if (companies) {
      reply.status(200).send({
        companies,
      });
    } else {
      console.log("Error Fetching Data");
      console.trace("Null Values");
      reply.status(200).send({
        message: "Server is Busy.Please try Again",
      });
    }
  } else {
    reply.status(400).send({
      message: "Please try Again",
    });
  }
});

//post route to update the information of the supplier and company
//which is displayed on the drawer of the react project

// post route for uploading the company image
router.post("/uploadCompanyImage", async (request, reply) => {
  uploadCompanyImages(request, reply, (err) => {
    if (err) {
      console.log(err.message);
      return reply.status(200).send({ messages: err.message, type: "danger" });
    } else {
      var filePath = request.files[0].destination.split("/public")[1];
      DataBase.company
        .update(
          {
            companyLogo: filePath + "/" + request.files[0].filename,
          },
          {
            where: {
              companyUUID: request.body.companyUUID,
              userID: request.body.id,
            },
          }
        )
        .then((result) => {
          console.log(result);
          if (result) {
            reply.status(200).send({
              messages: "Done",
              filePath: filePath + "/" + request.files[0].filename,
            });
            reply.end();
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
          }
        });
    }
  });
  return reply;
});
