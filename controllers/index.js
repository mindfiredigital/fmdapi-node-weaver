const { signin, signout, validateSession } = require("./auth");
const {
  createRecord,
  getRecordById,
  getAllRecords,
  findRecord,
} = require("./record");
const { executeScript } = require("./script");

// Define an array of controller methods that should skip the validateSession middleware
const controllersToSkipValidation = ["signin"];

exports.dataApi = async (req, res) => {
  const { method } = req.body;

  // Check if the method should skip validation
  if (!controllersToSkipValidation.includes(method)) {
    // If the method is not in the skip list, apply the validateSession middleware
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

        default:
          res.status(500).json({ error: "Invalid method" });
      }
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
};
