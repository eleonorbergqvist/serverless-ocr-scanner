const handler = require('../handler');

afterEach(() => {
	jest.restoreAllMocks()
});

test('that endpoint fails if document is missing', async () => {
  const resp = await handler.getImageText({ body: JSON.stringify({}) });
  expect(resp.statusCode).toBe(400);
});

test('that data uri gets reformatted to base64 if sent', async () => {
  const textract = require("../textract");
  textract.analyzeDocument = jest.fn(
    _ => require('../mocks/textract.analyzeDocument-instructions.json')
  );

  const resp = await handler.getImageText({
    body: JSON.stringify({
      document: "data:image/png;base64,AAAA"
    })
  });

  expect(resp.statusCode).toBe(200);
  expect(textract.analyzeDocument.mock.calls.length).toBe(1);
  expect(textract.analyzeDocument.mock.calls[0][0]).toBe("AAAA");
});

test('that that endpoint supports raw data from aws', async () => {
  const textract = require("../textract");
  textract.analyzeDocument = jest.fn(
    _ => require('../mocks/textract.analyzeDocument-instructions.json')
  );

  const resp = await handler.getImageText({
    queryStringParameters: {
      format: "raw"
    },
    body: JSON.stringify({
      document: "data:image/png;base64,AAAA"
    })
  });

  expect(resp.statusCode).toBe(200);
  expect(resp.body.indexOf("BlockType") !== -1).toBe(true);
});

test('that that endpoint supports line formatting', async () => {
  const textract = require("../textract");
  textract.analyzeDocument = jest.fn(
    _ => require('../mocks/textract.analyzeDocument-instructions.json')
  );

  const resp = await handler.getImageText({
    queryStringParameters: {
      format: "lines"
    },
    body: JSON.stringify({
      document: "data:image/png;base64,AAAA"
    })
  });

  expect(resp.statusCode).toBe(200);
  expect(resp.body.indexOf("BlockType") === -1).toBe(true);
});
