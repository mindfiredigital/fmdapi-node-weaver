<h1 align="center">fmdapi-node-weaver </h1><br><br>
<p align="center">
<!-- <a href="https://www.npmjs.com/package/@mindfiredigital/fmdapi-node-weaver"><img src="https://img.shields.io/npm/v/@mindfiredigital/fmdapi-node-weaver.svg?sanitize=true" alt="Version"></a>
<a href="https://www.npmjs.com/package/@mindfiredigital/fmdapi-node-weaver"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs"></a> -->
</p>

<br>

<p align="center"> Simplify the integration of FileMaker databases with any frontend</p>

The `@mindfiredigital/fmdapi-node-weaver` is a tool that allows developers to integrate multi page document editors built on top of Canvas using React.

<br>

![FM_DataApi_Bundler_Image](https://github.com/BasudevBharatBhushan/node-data-api/assets/64151314/c225d6ac-2d87-4c28-84c7-a950a58d2d12)
**NOTE:** : The endpoints shown in figure are for demo purpose, these are not actual endpoints. For actual Data API endpoint, refer documentation

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [License](#license)

<br>

## Features

- **No Mandatory Session Token**: Unlike the standard FileMaker Data API, the Bundler does not require a validated session token for every API call. It handles authentication using Basic Auth, generating a new session token if one is not provided or if the session has expired.

- **Uniform API Endpoints**: Each API endpoint in the Bundler follows a consistent style, simplifying usage and reducing confusion. Regardless of the specific API functionality, you'll find a consistent method structure.

- **Automatic Session Management**: Users don't need to worry about re-validating their session each time they interact with the API. The Bundler automatically manages sessions by using Basic Auth as an authentication header.

<br>

## Installation

To install the @mindfiredigital/fmdapi-node-weaver npm package in your project, use the following command:

```bash
npm install @mindfiredigital/fmdapi-node-weaver
```

- **Initialization**: Initialize the fmdapi-node-weaver in your project, specifying the function.

```javascript
const fm = require("fmdapi-node-weaver");

const PORT = 9000;

fm.run(PORT);

//If PORT is not specified, it will run on default port 8000
```

## Installation (Without using NPM)

To download the project `@mindfiredigital/fmdapi-node-weaver` into your system, use the following command:

```bash
git clone https://github.com/mindfiredigital/fmdapi-node-weaver
```

<br>

## Getting Started

- **Initialization**: Install the dependencies from the package.json:

```bash
npm i
```

or

```bash
yarn
```

- **Launch the server**

```bash
node app.js
```

<br>

## Docker Integration

To containerize your application using Docker, follow these steps:

- **Build Docker Image**: Build the Docker image using the provided Dockerfile:

```bash
docker build -t fmdapi-node-weaver .
```

- **Run Docker Container**: Run the Docker container, mapping the desired port (e.g., 3000) to the container's port:

```bash
docker run -p 3000:3000 fmdapi-node-weaver
```

## Contributing

We welcome contributions from the community. If you'd like to contribute to the `fmdapi-node-weaver` npm package, please follow our [Contributing Guidelines](CONTRIBUTING.md).
<br>

## License

Copyright (c) Mindfire Digital llp. All rights reserved.

Licensed under the MIT license.
