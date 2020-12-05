const expressTemplate = () => {
  return `const express = require('express');
const cors = require('cors');
const fs = require('fs');

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());

// [NEW ENDPOINT]

app.listen(PORT, () => {
  console.log('Express server is running on port', PORT)
});`
}

module.exports = {
  expressTemplate
}
