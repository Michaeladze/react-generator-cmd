# react-generator-cmd

Install dependencies in your project
```js
yarn add redux react-redux redux-observable redux-actions redux-actions-ts axios axios-observable
```
Install devDependencies in your project
```js
yarn add -D redux-devtools-extension @types/redux-actions @types/react-redux
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