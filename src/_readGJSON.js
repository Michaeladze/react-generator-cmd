const { fileExists, readFileSync } = require('./mk');

const defaultConfig = {
  "root": "./src",
  "testAlias": "spec",
  "structure": {
    "components": ""
  }
}

function readGJSON() {
  const GJSONExists = fileExists('./g.json');

  if (!GJSONExists) {
    return defaultConfig;
  }

  const json = readFileSync('./g.json', { encoding: 'utf-8' });

  if (!json) {
    return defaultConfig;
  }

  let result = JSON.parse(json);

  if (Object.keys(result.structure).length === 0) {
    result.structure = {
      components: ""
    }
  }

  return result;
}

module.exports = readGJSON;
