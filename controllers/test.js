// require("dotenv").config();
// const axios = require("axios");
// const https = require("https");
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// const httpsAgent = new https.Agent({
//   rejectUnauthorized: false,
// });

// exports.test = async (req, res) => {
//   const token = req.token;
//   const user = req.user;
//   const { database, layout, script, param } = req.body.methodBody;

//   try{
//     const token = await fmLogin
//   }catch(error){

//   }
// };

// const fmLogin = async (fmServer, database, credentials, httpsAgent) => {
//   try {
//     const loginResponse = await axios.post(
//       `https://${fmServer}/fmi/data/vLatest/databases/${database}/sessions`,
//       {},
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Basic ${credentials}`,
//         },
//       },
//       { httpsAgent }
//     );

//     return loginResponse.data.response.token;
//   } catch (error) {
//     throw error;
//   }
// };

const axios = require("axios");
const jwt = require("jsonwebtoken");

// Utility function for FileMaker login
const fmLogin = async (fmServer, database, credentials, httpsAgent) => {
  try {
    const loginResponse = await axios.post(
      `https://${fmServer}/fmi/data/vLatest/databases/${database}/sessions`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${credentials}`,
        },
      },
      { httpsAgent }
    );

    return loginResponse.data.response.token;
  } catch (error) {
    throw error;
  }
};

// Utility function for FileMaker session validation
const fmValidateSession = async (fmServer, sessionToken, httpsAgent) => {
  try {
    const validateResponse = await axios.get(
      `https://${fmServer}/fmi/data/vLatest/validateSession`,
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      },
      { httpsAgent }
    );

    return validateResponse.data.messages[0].message === "OK";
  } catch (error) {
    throw error;
  }
};

// Sign-in controller
exports.signin = async (req, res) => {
  console.log(req.body);
  const { username, password, database, fmServer } = req.body.methodBody;

  // Encode the username and password
  const credentials = Buffer.from(`${username}:${password}`).toString("base64");
  console.log(credentials);

  try {
    // Call the fmLogin utility function to perform FileMaker login
    const sessionToken = await fmLogin(
      fmServer,
      database,
      credentials,
      httpsAgent
    );

    // Check if login was successful
    if (sessionToken) {
      // Call the fmValidateSession utility function to validate the session
      const isSessionValid = await fmValidateSession(
        fmServer,
        sessionToken,
        httpsAgent
      );

      if (isSessionValid) {
        // Create a new JWT session token (valid for 30 minutes)
        const payload = {
          user: username,
          sessionToken,
        };
        const expiresIn = 1800;

        const sessionJwtToken = jwt.sign(payload, process.env.SECRET, {
          expiresIn,
        });

        const expirationTime = new Date();
        expirationTime.setMinutes(expirationTime.getMinutes() + 30);

        // Return the access token in the response
        res.json({
          access_token: sessionJwtToken,
          expires_in: expiresIn,
          username: username,
          database: database,
        });
      } else {
        res.status(401).json({ error: "Access token validation failed" });
      }
    } else {
      // Sign-in was not successful, return an error response
      res.status(401).json({ error: "Sign-in failed" });
    }
  } catch (error) {
    console.log(error);
    const responseJson = {
      error: "An error occurred while signing in.",
    };

    if (error.response && error.response.statusText) {
      responseJson.statusText = error.response.statusText;
      responseJson.error = error.response.data;
    }

    res.status(500).json(responseJson);
  }
};
