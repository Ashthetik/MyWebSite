const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const path = require('path')
app.use(express.static(path.join(__dirname, 'assets')))

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});