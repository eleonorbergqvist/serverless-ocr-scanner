const AWS = require("aws-sdk");

const analyzeDocument = async (document) => {
  const client = new AWS.Textract();
  const params = {
    Document: {
      //Bytes: new Buffer('...') || 'STRING_VALUE' [> Strings will be Base-64 encoded on your behalf <],
      //Bytes: document,
      Bytes: new Buffer(document, 'base64'),
    },
    FeatureTypes: [
      "TABLES",
    ]
  };

  return client.analyzeDocument(params).promise()
}

module.exports = {
  analyzeDocument,
}
