const AWS = require("aws-sdk");
const textract = require("./textract")
const textractParser = require("./textractParser")

const getImageText = async (event, context) => {
  let { document } = JSON.parse(event.body);

  const queryStringParameters = event.queryStringParameters || {};
  let format = "raw";
  if (queryStringParameters.format) {
    format = queryStringParameters.format;
  }

  if (!document) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Missing document param",
      })
    }
  }

  // Detect Data URI and transform to base64
  if (document.indexOf("data:image") === 0) {
    document = document.split(";base64,")[1];
  }

  let analyzeData = null;
  try {
    //analyzeData = require('./mocks/textract.analyzeDocument-instructions.json');
    analyzeData = await textract.analyzeDocument(document);
  } catch (err) {
    return {
      statusCode: err.statusCode || 400,
      body: JSON.stringify({
        message: "Error passing data to analyze",
        code: err.code,
      })
    };
  }

  let responseData = textractParser.parseToBlockTree(analyzeData);
  if (format === "lines") {
    responseData = textractParser.blockTreeToTextLines(responseData);
  }

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify({
      data: responseData,
    })
  }
};


module.exports = {
  getImageText,
}
