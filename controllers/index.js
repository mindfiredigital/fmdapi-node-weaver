const { signin, signout } = require("./auth");
const { createRecord, getRecordById, getAllRecords } = require("./record");

exports.dataApi = async (req, res) => {
  const { method } = req.body;

  switch (method) {
    case "signin":
      signin(req, res);
      break;
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
    default:
      res.status(500).json({ error: "Invalid method" });
  }
};
