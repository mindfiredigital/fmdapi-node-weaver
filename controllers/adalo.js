require("dotenv").config();
const axios = require("axios");
const https = require("https");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

exports.syncCollection = async (req, res) => {
  console.log("reaching here ------------------sync collection");
  const token = req.fmSessionToken;
  const { database, layout } = req.body.methodBody;

  try {
    const adaloHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer 4veggnipvsy6auu4kdo0zedmx`,
    };

    // Step 1: Get All Records from Adalo
    let adaloRecords = await axios.get(
      `https://api.adalo.com/v0/apps/21a2a65b-9c58-4b1d-9fac-ea24f1b58642/collections/t_8a7ovv8bjlh4qpofxz9ibblv5`,
      { headers: adaloHeaders, httpsAgent }
    );

    adaloRecords = adaloRecords.data.records;

    // Get All records from FM Server
    const fmServerRecords = await getAllRecords(
      token,
      req.body.fmServer,
      database,
      layout,
      adaloRecords.length
    );

    // Loop through FM Server records and make a POST request for each record
    for (const fmRecord of fmServerRecords) {
      const postData = {
        Name: fmRecord.Name,
        Address: fmRecord.Address,
        Phone: fmRecord.Phone,
      };

      // Make a POST request to Adalo
      await axios.post(
        `https://api.adalo.com/v0/apps/21a2a65b-9c58-4b1d-9fac-ea24f1b58642/collections/t_8a7ovv8bjlh4qpofxz9ibblv5`,
        postData,
        { headers: adaloHeaders, httpsAgent }
      );

      // You can log a message or perform other actions for each record if needed
      console.log(`Posted record: ${JSON.stringify(postData)}`);
    }

    res.send("Sync Complete");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error occurred during synchronization.");
  }
};

getAllRecords = async (token, fmServer, database, layout, offset, limit) => {
  const apiUrl = `https://${fmServer}/fmi/data/vLatest/databases/${database}/layouts/${layout}/records`;

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const queryParam = {
    _offset: offset,
    _limit: limit,
  };

  try {
    const recordResponse = await axios.get(apiUrl, {
      params: queryParam,
      headers,
      httpsAgent,
    });

    if (recordResponse.data.messages[0].message === "OK") {
      const records = recordResponse.data.response.data.map(
        (record) => record.fieldData
      );
      console.log(records);

      return records;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};
