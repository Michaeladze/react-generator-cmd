# react-generator-cmd

Install dependencies
```js
yarn add redux react-redux redux-observable redux-actions redux-actions-ts axios axios-observable express cors
```
Install devDependencies
```js
yarn add -D redux-devtools-extension @types/redux-actions @types/react-redux jest ts-jest @types/jest
```

Install CLI
```js
yarn add -D react-generator-cmd
```

Add script to package.json
```js
scripts: {
  "g": "node node_modules/react-generator-cmd/dist"
}
```

Run generator
```js
npm run g
yarn g
```

To run tests add this lines to package.json
```js
"jest": {
    "transform": {
      "^.+\\.(ts|tsx)?$": "ts-jest"
    },
    "testEnvironment": "jsdom"
  }
```

## Config

```json
{
  "root": "./src",
  "structure": {
    "components": {
      "Shared": "",
      "Features": {
        ":id": ""
      },
      "Pages": "",
      "Templates": "",
      "Popups": ""
    }
  },
  "css": "styled",
  "reduxFolder": "redux",
  "testAlias": "spec",
  "explicit": false
}
```
