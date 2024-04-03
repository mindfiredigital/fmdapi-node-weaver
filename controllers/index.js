const { signin, signout, validateSession, validateToken } = require("./auth");
const {
  createRecord,
  getRecordById,
  getAllRecords,
  findRecord,
  updateRecord,
  uploadContainer,
} = require("./record");
const { executeScript } = require("./script");
const { test } = require("./test");
const formidable = require("formidable");
const fs = require("fs");

// Define an array of controller methods that should skip the validateSession middleware
const controllersToSkipValidation = ["signin"];

exports.dataApi = async (req, res) => {
  if (req.headers["content-type"].includes("multipart/form-data")) {
    const form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
      originalFileName = files.upload[0].originalFilename;

      const fileData = fs.readFileSync(files.upload[0].filepath); // Read file data
      const blob = new Blob([fileData], { type: files.upload[0].mimetype }); // Create a Blob object

      const formObj = new FormData();
      formObj.append("upload", blob, originalFileName);

      req.formObj = formObj;

      const session = {
        token: StringifyObject(fields.token),
        required: StringifyObject(fields.sessionRequired),
      };

      const methodBody = {
        database: StringifyObject(fields.database),
        layout: StringifyObject(fields.layout),
        recordId: StringifyObject(fields.recordId),
        fieldName: StringifyObject(fields.fieldName),
        fieldRepetition: StringifyObject(fields.fieldRepetition),
      };

      req.body.session = session;
      req.body.methodBody = methodBody;
      req.body.method = StringifyObject(fields.method);
      req.body.fmServer = StringifyObject(fields.fmServer);

      // console.log(req.body);

      return validateToken(req, res, () => {
        return validateSession(req, res, () => {
          switch (req.body.method) {
            case "uploadContainer":
              uploadContainer(req, res);
              break;

            default:
              res.status(500).json({ error: "Invalid method" });
          }
        });
      });
    });
  } else {
    const { method } = req.body;

    // Check if the method should skip validation
    if (!controllersToSkipValidation.includes(method)) {
      // If the method is not in the skip list, apply the validateToken middleware first
      return validateToken(req, res, () => {
        // After token validation, apply the validateSession middleware
        return validateSession(req, res, () => {
          // Once validated, call the appropriate controller method
          switch (method) {
            case "signout":
              signout(req, res);
              break;
            case "createRecord":
              createRecord(req, res);
              break;
            case "getRecordById":
              getRecordById(req, res);
              break;
            case "getAllRecords":
              getAllRecords(req, res);
              break;
            case "findRecord":
              findRecord(req, res);
              break;
            case "executeScript":
              executeScript(req, res);
              break;
            case "updateRecord":
              updateRecord(req, res);
              break;
            case "test":
              test(req, res);
              break;
            case "uploadContainer":
              uploadContainer(req, res);
              break;

            default:
              res.status(500).json({ error: "Invalid method" });
          }
        });
      });
    }

    // If the method should skip validation, call the controller method directly
    switch (method) {
      case "signin":
        signin(req, res);
        break;

      default:
        res.status(500).json({ error: "Invalid method" });
    }
  }
};

const StringifyObject = (obj) => {
  return JSON.parse(JSON.stringify(obj))[0];
};
