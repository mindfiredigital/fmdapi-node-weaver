var express = require("express");
var router = express.Router();

const { dataApi } = require("../controllers/index");

router.post("/dataApi", dataApi);

module.exports = router;
