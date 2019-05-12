const R = require("ramda");

/**
 * Accepts data in aws block tree format and formats it to a tree (block tree).

 * Input:
  {
    "DocumentMetadata": {
      "Pages": 1
    },
    "Blocks": [
      {
        "BlockType": "PAGE",
        "Id": "fbab1fff-8bc5-494a-a99f-db03fafd74cb",
        "Relationships": [{
            "Type": "CHILD",
            "Ids": [
              "1a37b742-8208-480c-9f9c-6af35f7aeef9",
            ]
          }]
      },
      {
        "BlockType": "LINE",
          ....

 * Output:
  [
    {
      "BlockType": PAGE",
      "Id": "fbab1fff-8bc5-494a-a99f-db03fafd74cb",
    },
    [
      {
        "BlockType": "LINE",
        "Id": "1231aa-8bc5-494a-a99f-db03fafd74cb",
      },
      [
        {
          "BlockType": "WORD",
        },
        []
      ]
    ]
  ]
 */
const parseToBlockTree = (data) => {
  const blocks = data["Blocks"];

  const blocksReferenceTable = {}
  for (var x in blocks) {
    let block = blocks[x]
    blocksReferenceTable[block.Id] = block;
  }

  const buildRecursiveBlockTree = (block) => {
    let relationships = block.Relationships || [];
    relationships = relationships.length > 0 ? relationships[0] : {}

    const childIds = relationships.Ids || [];

    let children = childIds.map(id => blocksReferenceTable[id])
    children = children.filter(x => x.BlockType !== "WORD")
    children = children.map(x => buildRecursiveBlockTree(x))

    return [block, children];
  }

  const pages = blocks.filter(x => x.BlockType === "PAGE")
  if (!pages.length) {
    return [];
  }

  return buildRecursiveBlockTree(pages[0]);
}

/**
 * Transforms a block tree  to a text representation.
 *
 * Input: A block tree (see example data from parseToBlockTree))
 * Output:
  [
    "PANCAKES AND STRAWBERRIES",
    "1 mg sugar",
    "2 mg wheat",
  ]
 */
const blockTreeToTextLines = (blockTree) => {
  const toText = (entry) => {
    return [
      entry[0].Text,
      entry[1].map(toText),
    ];
  }

  let text = toText(blockTree);
  text = R.flatten(text);
  return text.filter(x => Boolean(x))
}

module.exports = {
  parseToBlockTree,
  blockTreeToTextLines,
}
