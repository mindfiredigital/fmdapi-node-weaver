require("dotenv").config();
const axios = require("axios");
const https = require("https");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

exports.signin = async (req, res) => {
  console.log(req.body);
  const { username, password, database } = req.body.methodBody;

  // Encode the username and password
  const credentials = Buffer.from(`${username}:${password}`).toString("base64");
  console.log(credentials);
  try {
    const loginResponse = await axios.post(
      `https://${req.body.fmServer}/fmi/data/vLatest/databases/${database}/sessions`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${credentials}`,
        },
      },
      { httpsAgent }
    );

    const sessionToken = loginResponse.data.response.token;

    // Call the validateSession route
    const validateResponse = await axios.get(
      `${process.env.FM_DATA_API_URL}/validateSession`,
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      },
      { httpsAgent }
    );

    // Check if the validation response is OK
    if (validateResponse.data.messages[0].message === "OK") {
      /*Put token in cookie and set expiration time to 30 minutes*/
      const expirationTime = new Date();
      expirationTime.setMinutes(expirationTime.getMinutes() + 30);
      res.cookie("token", sessionToken, { expires: expirationTime });

      /* Return the access token in the response*/
      res.json({
        access_token: sessionToken,
        username: username,
        database: database,
      });
    } else {
      res.status(401).json({ error: "Access token validation failed" });
    }
  } catch (error) {
    const responseJson = {
      error: "An error occurred while signing in.",
    };

    if (error.response && error.response.statusText) {
      responseJson.statusText = error.response.statusText;
    }

    res.status(500).json(responseJson);
  }
};

exports.signout = async (req, res) => {
  res.clearCookie("token");

  const { database, token } = req.body.methodBody;
  console.log(token);

  try {
    const logoutResponse = await axios.delete(
      `https://${req.body.fmServer}/fmi/data/vLatest/databases/${database}/sessions/${token}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        httpsAgent, // Include httpsAgent here
      }
    );

    if (logoutResponse.data.messages[0].message === "OK") {
      res.json({ message: "Signout success" });
    } else {
      res.status(401).json({ error: "Signout failed" });
    }
  } catch (error) {
    const responseJson = {
      error: "An error occurred while signing out.",
    };

    if (error.response && error.response.statusText) {
      responseJson.statusText = error.response.statusText;
    }

    res.status(500).json(responseJson);
  }
};
