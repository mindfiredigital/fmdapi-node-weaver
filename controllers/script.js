require("dotenv").config();
const axios = require("axios");
const https = require("https");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

exports.executeScript = async (req, res) => {
  const token = req.fmSessionToken;
  const user = req.user;
  const { database, layout, script, param } = req.body.methodBody;

  const apiUrl = `https://${req.body.fmServer}/fmi/data/vLatest/databases/${database}/layouts/${layout}/script/${script}`;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const queryParam = {
    "script.param": param,
  };

  try {
    const response = await axios.get(apiUrl, {
      params: queryParam,
      headers,
      httpsAgent,
    });

    if (response.data.messages[0].message === "OK") {
      res.status(200).json({
        status: "Script Executed Successfully",
        session: req.fmSessionToken,
      });
    }
  } catch (error) {
    console.error(error);
    const responseJson = {
      error: "An error while executing the script.",
    };

    if (error.response && error.response.statusText) {
      responseJson.statusText = error.response.statusText;
      responseJson.error = error.response.data;
    }

    res.status(500).json(responseJson);
  }
};
