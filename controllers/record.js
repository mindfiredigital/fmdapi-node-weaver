require("dotenv").config();
const axios = require("axios");
const https = require("https");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

exports.createRecord = async (req, res) => {
  const { record, token, database, layout } = req.body.methodBody;

  const apiUrl = `https://${req.body.fmServer}/fmi/data/vLatest/databases/${database}/layouts/${layout}/records`;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const requestData = {
    fieldData: record,
  };

  try {
    const response = await axios.post(apiUrl, requestData, {
      headers,
      httpsAgent,
    });
    const recordId = response.data.response.recordId;
    res.status(201).json({ status: "created", recordId, fieldData: record });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the record." });
  }
};

exports.getRecordById = async (req, res) => {
  const { token, database, layout, Id } = req.body.methodBody;

  const apiUrl = `https://${req.body.fmServer}/fmi/data/vLatest/databases/${database}/layouts/${layout}/_find`;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const requestBody = {
    query: [
      {
        Id: `=${Id}`,
      },
    ],
  };

  try {
    const response = await axios.post(apiUrl, requestBody, {
      headers,
      httpsAgent,
    });
    const record = response.data.response.data[0]?.fieldData;
    if (record) {
      res.status(200).json({ record });
    } else {
      res.status(404).json({ error: "Record not found." });
    }
  } catch (error) {
    console.error(error);
    const responseJson = {
      error: "An error occurred while fetching the record.",
    };

    if (error.response && error.response.statusText) {
      responseJson.statusText = error.response.statusText;
    }

    res.status(500).json(responseJson);
  }
};

exports.getAllRecords = async (req, res) => {
  const { token, database, layout } = req.body.methodBody;
  const apiUrl = `https://${req.body.fmServer}/fmi/data/vLatest/databases/${database}/layouts/${layout}/records`;

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  try {
    const recordResponse = await axios.get(apiUrl, { headers, httpsAgent });

    if (recordResponse.data.messages[0].message === "OK") {
      const records = recordResponse.data.response.data.map(
        (record) => record.fieldData
      );

      console.log(recordResponse.data.response.dataInfo.table);

      res.status(200).json({
        recordInfo: {
          table: recordResponse.data.response.dataInfo.table,
          layout: recordResponse.data.response.dataInfo.layout,
          totalRecordCount:
            recordResponse.data.response.dataInfo.totalRecordCount,
        },
        records,
      });
    }
  } catch (error) {
    console.log(error);
    const responseJson = {
      error: "An error occurred while fetching the record.",
    };

    if (error.response && error.response.statusText) {
      responseJson.statusText = error.response.statusText;
    }

    res.status(500).json(responseJson);
  }
};
