

const express = require('express');
const path = require("path");
const app = express();


app.use(express.static(path.join(__dirname, "./dist")));

app.listen(8000, function () {
    console.log(`Listening on port: 8000`)
})