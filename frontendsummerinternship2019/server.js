const express = require('express');
const serveStatic = require('serve-static');
const path = require('path');
const fs = require('fs');
const app = express();

app.use('/', serveStatic(path.join(__dirname, '/dist')));
app.use('/public', express.static('public'))

app.get(/.*/, (req, res) => {
    console.log('should dispaly index.html');
    res.sendFile(__dirname + '/dist/index.html');
})

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log("Listening on port: " + port);
});
