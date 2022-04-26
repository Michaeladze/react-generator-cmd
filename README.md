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

Create a `g.json` file in the root folder.

`root` - The root folder where files are created

`structure` - the structure of your folders in the project. You can add dynamic names by using `:` prefix. When generator detects the dynamic name, it will ask to create new folder inside it or select the existing one.

`css` - accepts values `css | scss | less | styled`. 

`reduxFolder` - the folder where redux is stored.

`testAlias` - `spec | test`.

`explicit` - boolean. By default, is set to `false`. If a folder contains just one folder inside, with explicit flag equal to true generator will still ask you about that folder.

#### Example:
```json
{
  "root": "./src",
  "structure": {
    "components": {
      "shared": "",
      "features": {
        ":id": ""
      },
      "pages": "",
      "templates": "",
      "popups": ""
    }
  },
  "css": "styled",
  "reduxFolder": "redux",
  "testAlias": "spec",
  "explicit": false
}
```
