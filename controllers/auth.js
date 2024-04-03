require("dotenv").config();
const axios = require("axios");
const https = require("https");
const jwt = require("jsonwebtoken");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

/* Middlewares */

exports.validateToken = async (req, res, next) => {
  // Get the Authorization header from the request
  const authHeader = req.headers["authorization"];

  // Check if the Authorization header is present
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header is missing" });
  }

  // The Authorization header typically looks like "Basic base64-encoded-credentials"
  const authHeaderParts = authHeader.split(" ");

  // Check if it's in the expected format
  if (
    authHeaderParts.length !== 2 ||
    authHeaderParts[0].toLowerCase() !== "basic"
  ) {
    return res
      .status(400)
      .json({ error: "Invalid Authorization header format" });
  }

  req.basicAuthToken = authHeaderParts[1];

  next();
};

exports.validateSession = async (req, res, next) => {
  const basicAuthToken = req.basicAuthToken;
  const { session } = req.body;
  const { token, required } = session || {};
  const { database } = req.body.methodBody;
  const { fmServer } = req.body;

  let shouldCallNext = false; // Flag to track if next() should be called

  // Case 1: No session information is provided
  if (!session || !token) {
    try {
      const fmSessionToken = await fmLogin(
        fmServer,
        database,
        basicAuthToken,
        httpsAgent
      );

      if (fmSessionToken) {
        const isSessionValid = await fmValidateSession(
          fmServer,
          fmSessionToken,
          httpsAgent
        );

        if (isSessionValid) {
          req.fmSessionToken = fmSessionToken;
          shouldCallNext = true; // Set the flag to true
        } else {
          res.status(401).json({ error: "Session token validation failed" });
        }
      }
    } catch (error) {
      res.status(401).json({ error });
    }
  } else {
    try {
      const isSessionValid = await fmValidateSession(
        fmServer,
        token,
        httpsAgent
      );

      if (isSessionValid) {
        req.fmSessionToken = token;
        shouldCallNext = true; // Set the flag to true
      } else {
        // Case 2: Session token is provided but not required
        if (token && (!required || required === false)) {
          try {
            const fmSessionToken = await fmLogin(
              fmServer,
              database,
              basicAuthToken,
              httpsAgent
            );

            if (fmSessionToken) {
              const isSessionValid = await fmValidateSession(
                fmServer,
                fmSessionToken,
                httpsAgent
              );

              if (isSessionValid) {
                req.fmSessionToken = fmSessionToken;
                shouldCallNext = true; // Set the flag to true
              } else {
                res
                  .status(401)
                  .json({ error: "Re-validation of session token failed" });
              }
            } else {
              res.status(401).json({ error: "Re-authentication failed" });
            }
          } catch (error) {
            res.status(401).json({ error });
          }
        } else {
          // Case 3: Session token is provided and required
          res.status(401).json({ error: "Invalid session token" });
        }
      }
    } catch (error) {
      res.status(401).json({ error: "Session validaton failed" });
    }
  }

  if (shouldCallNext) {
    next(); // Call next() only if the flag is true
  }
};

/* Controller Methods */
exports.signin = async (req, res) => {
  const { fmServer } = req.body;
  const { session, username, password, database } = req.body.methodBody;
  const { token, required } = session || {};

  if (token & required) {
    try {
      const isSessionValid = await fmValidateSession(
        fmServer,
        token,
        httpsAgent
      );

      if (isSessionValid) {
        res.status(200).json({
          message: "Signin Successful",
          database: database,
          session: fmSessionToken,
        });
      } else {
        res
          .status(401)
          .json({ error: "Session Expired or Invalid Session Token provided" });
      }
    } catch {
      res.status(401).json(error);
    }
  }

  // Encode the username and password
  const basicAuthToken = Buffer.from(`${username}:${password}`).toString(
    "base64"
  );

  try {
    // Call the fmLogin utility function to perform FileMaker login
    console.log(fmServer);
    const fmSessionToken = await fmLogin(
      fmServer,
      database,
      basicAuthToken,
      httpsAgent
    );

    // Check if login was successful
    if (fmSessionToken) {
      // Call the fmValidateSession utility function to validate the session
      const isSessionValid = await fmValidateSession(
        fmServer,
        fmSessionToken,
        httpsAgent
      );

      if (isSessionValid) {
        // Return the access token in the response
        res.status(200).json({
          message: "Signin Successful",
          database: database,
          session: fmSessionToken,
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
  const token = req.fmSessionToken;
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
      responseJson.error = error.response.data;
    }

    res.status(500).json(responseJson);
  }
};

/* Utility Methods */
const fmLogin = async (fmServer, database, basicAuthToken, httpsAgent) => {
  console.log(
    `https://${fmServer}/fmi/data/vLatest/databases/${database}/sessions`
  );
  try {
    const loginResponse = await axios.post(
      `https://${fmServer}/fmi/data/vLatest/databases/${database}/sessions`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${basicAuthToken}`,
        },
      },
      { httpsAgent }
    );
    // console.log(loginResponse);
    return loginResponse.data.response.token;
  } catch (error) {
    // console.log("fmLogin Error: ", error);
    const responseJson = {
      error: "An error occurred while logging in.",
    };

    if (error.response && error.response.statusText) {
      responseJson.statusText = error.response.statusText;
      responseJson.error = error.response.data;
    }

    throw responseJson;
  }
};

const fmValidateSession = async (fmServer, sessionToken, httpsAgent) => {
  try {
    const validateResponse = await axios.get(
      `https://${fmServer}/fmi/data/vLatest/validateSession`,
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
        httpsAgent,
      }
    );

    return validateResponse.data.messages[0].message === "OK";
  } catch (error) {
    return false; // Return false if there was an error
  }
};
