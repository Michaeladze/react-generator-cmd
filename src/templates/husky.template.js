const huskyTemplate = () => {

  // "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"

  return `  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint ./src --format=table --fix",
      "git add ."
    ],
    "*.{css,scss}": [
      "npx stylelint ./src/**/*.scss --fix",
      "git add ."
    ]
  }`
}

module.exports = {
  huskyTemplate
}
