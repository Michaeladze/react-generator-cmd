const { fileExists, readFileSync } = require('./mk');

const defaultConfig = {
  "root": "./src",
  "structure": {
    "components": ""
  },
  "css": "css",
  "redux": {
    "folder": "redux"
  },
  "testAlias": "spec",
  "explicit": false,
  "router": {
    "path": "/router"
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

  result.redux.folder =  result.redux.folder || '_store';
  result.explicit =  result.explicit || false;
  result.testAlias =  result.testAlias || 'spec';

  return result;
}

module.exports = readGJSON;
