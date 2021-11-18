const multer = require("multer"),
  path = require("path");

const storage = multer.diskStorage({
  destination: function (request, file, cb) {
    cb(null, "../taskFluxe/public/assets/companyImage");
  },
  filename: function (request, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const imageFilter = (req, file, cb) => {
  const types = /jpeg|jpg|png|gif/;
  const fileBreakdown = file.mimetype.split("/");
  const extnames = types.test(fileBreakdown[1].toLowerCase());
  const mimetype = types.test(file.mimetype);
  if (extnames && mimetype) return cb(null, true);
  else {
    return cb(Error("Wrong File Type"));
  }
};
const uploadCompanyImages = multer({
  storage: storage,
  fileFilter: imageFilter,

  limits: { fileSize: 1000000 },
  onError: (err, next) => {
    console.log("error", err);
  },
}).any();
module.exports = { uploadCompanyImages };
