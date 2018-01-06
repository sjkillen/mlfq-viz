
/**
 * Simple server to serve builds
 */

const express = require("express");
const path = require("path");
const webpack = require("webpack");
const app = express();
const assert = require("assert");
require("dotenv").config();

assert(process.env.PORT, "Specify a PORT in a .env");

app.use(express.static(path.join(__dirname, "./dist")));

app.listen(process.env.PORT, () =>
    // tslint:disable-next-line
    console.log(`Server listening on port ${process.env.PORT}`)
);
