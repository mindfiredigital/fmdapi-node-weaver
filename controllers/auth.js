require("dotenv").config();
const axios = require("axios");
const https = require("https");
const jwt = require("jsonwebtoken");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

// Middleware to validate the session token
exports.validateSession = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      jwt.verify(token, process.env.SECRET, (err, payload) => {
        if (err) {
          return res.status(403).json({ error: "Forbidden" });
        }
        const { user, sessionToken } = payload;
        req.user = user;
        req.token = sessionToken;
        next();
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    // Handle cases where the Authorization header is missing or doesn't start with "Bearer ".
    res.sendStatus(401).json({
      error: "Authorization header is missing or has an invalid format",
    });
  }
};

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

    if (loginResponse.status === 200) {
      // Sign-in was successful, proceed to validate the session

      const sessionToken = loginResponse.data.response.token;
      console.log(loginResponse);

      // Call the validateSession route
      const validateResponse = await axios.get(
        `https://${req.body.fmServer}/fmi/data/vLatest/validateSession`,
        {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        },
        { httpsAgent }
      );

      // Check if the validation response is OK
      if (validateResponse.data.messages[0].message === "OK") {
        /* Create New JWT Session Token (Valid for 30 minutes) */

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

        /* Return the access token in the response*/
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

exports.signout = async (req, res) => {
  const user = req.user;
  const token = req.token;
  const { database } = req.body.methodBody;
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
      res.json({ user, message: "Signout success" });
    } else {
      res.status(401).json({ error: "Signout failed" });
    }
  } catch (error) {
    const responseJson = {
      error: "An error occurred while signing out.",
    };

    if (error.response && error.response.statusText) {
      responseJson.statusText = error.response.statusText;
      responseJson.error = error.response.data;
    }

    res.status(500).json(responseJson);
  }
};
