const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.get('/health', (req, res) => {
  return res.sendStatus(200);
});

app.use(express.static(path.join(__dirname, 'dist')));

app.use('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.use('/*', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('listening on port ' + PORT);
});
