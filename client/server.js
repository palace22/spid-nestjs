import{HomePage}from './src/app/home/home.page'
let home = new HomePage()
var express = require("express");
var app = express();
app.use(express.static("client")); // myApp will be the same folder name.
app.get("/", function (req, res, next) {
    home.setUser()
});
app.listen(3000, "localhost");
console.log("MyProject Server is Listening on port 8080");
