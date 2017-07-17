var mysql=require("mysql");
var config=require("./config.json");
var connection = mysql.createConnection({
    host     : config.hostname,
    user     : config.user,
    password : config.pass,
    database : config.database
});
module.exports=connection;