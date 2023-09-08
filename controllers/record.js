require("dotenv").config();
const axios = require("axios");
const https = require("https");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

exports.createRecord = async (req, res) => {
  const user = req.user;
  const token = req.token;
  const { record, database, layout } = req.body.methodBody;

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
    res
      .status(201)
      .json({ user, status: "created", recordId, fieldData: record });
  } catch (error) {
    console.error(error);
    const responseJson = {
      error: "An error occurred while creating the record.",
    };

    if (error.response && error.response.statusText) {
      responseJson.statusText = error.response.statusText;
      responseJson.error = error.response.data;
    }

    res.status(500).json(responseJson);
  }
};

exports.findRecord = async (req, res) => {
  const user = req.user;
  const token = req.token;
  const methodBody = req.body.methodBody;
  const { database, layout } = methodBody;

  const requestBody = {
    query: methodBody.query,
    sort: methodBody.sort,
    limit: methodBody.limit,
    offset: methodBody.offset,
    portal: methodBody.portal,
    dateformats: methodBody.dateformats,
    "layout.response": methodBody["layout.response"],
  };

  // Check if 'methodBody.scripts' exists and add its properties conditionally
  if (methodBody.scripts) {
    requestBody.script = methodBody.scripts.script;
    requestBody["script.param"] = methodBody.scripts["script.param"];
    requestBody["script.prerequest"] = methodBody.scripts["script.prerequest"];
    requestBody["script.prerequest.param"] =
      methodBody.scripts["script.prerequest.param"];
    requestBody["script.presort"] = methodBody.scripts["script.presort"];
    requestBody["script.presort.param"] =
      methodBody.scripts["script.presort.param"];
  }

  const apiUrl = `https://${req.body.fmServer}/fmi/data/vLatest/databases/${database}/layouts/${layout}/_find`;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await axios.post(apiUrl, requestBody, {
      headers,
      httpsAgent,
    });
    console.log(response.data);
    const record = response.data.response.data[0]?.fieldData;
    if (record) {
      res.status(200).json({ user, record });
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
      responseJson.error = error.response.data;
    }

    res.status(500).json(responseJson);
  }
};

exports.getRecordById = async (req, res) => {
  const user = req.user;
  const token = req.token;
  const { database, layout, Id } = req.body.methodBody;

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
      res.status(200).json({ user, record });
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
      responseJson.error = error.response.data;
    }

    res.status(500).json(responseJson);
  }
};

exports.getAllRecords = async (req, res) => {
  const user = req.user;
  const token = req.token;
  const { database, layout } = req.body.methodBody;
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
        user,
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
      responseJson.error = error.response.data;
    }

    res.status(500).json(responseJson);
  }
};
