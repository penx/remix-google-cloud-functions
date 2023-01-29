const { createRequestHandler } = require("remix-google-cloud-functions");

exports.remix = createRequestHandler({
  build: require("../build"),
});
