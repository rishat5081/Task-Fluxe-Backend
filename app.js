var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const Database = require("./DB_Sequelize/models");

var companyRouter = require("./routes/Company/company");
// var invoiceRouter = require("./routes/Invoice/invoice");
// var producLaunchRouter = require("./routes/Product Launch/productLaunch");
var supplierRouter = require("./routes/Supplier/supplier");
// var supplierComparisonRouter = require("./routes/Supplier Comparison/supplierComparison");
var webControllerRouter = require("./routes/Web Controllers/webControllers");
// var usersRouter = require("./routes/users");

var app = express();

// fastify.register(companyRoute, { prefix: "/company" });
// fastify.register(supplierRoute, { prefix: "/supplier" });
// fastify.register(invoiceRoute, { prefix: "/invoice" });
// fastify.register(supplierComparisonRoute, { prefix: "/supplierComparison" });
// fastify.register(productLaunchRoute, { prefix: "/productLaunch" });
// fastify.register(webControllers, { prefix: "/controller" });

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/company", companyRouter);
app.use("/controller", webControllerRouter);
app.use("/supplier", supplierRouter);
// app.use("/", indexRouter);
// app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.get("/", async (req, res) => {
  res.send(
    `<div style="display:flex;text-align:center; margin:auto"> <h1>Task Fluxe </h1> </div>`
  );
});

app.get("*", (req, res) => {
  res.send(
    `<div style="display:flex;text-align:center; margin:auto"> <h1>Task Fluxe </h1> </div>`
  );
});
// error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render("error");
// });

console.log("Works");

module.exports = app;
