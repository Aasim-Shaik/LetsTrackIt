var static = require('node-static');
const http = require('http');
const sqlite3 = require('sqlite3').verbose();
let db ;
let port = 4000;
 
//
// Create a node-static server instance to serve the './public' folder
//
var file = new static.Server('./static');
async function getData(){

return new Promise((resolve,reject)=>{
http.createServer(async function (request, response) {
  
    request.addListener('end', function () {
     
        file.serve(request, response);
    }).resume();
    
     if (request.method === 'POST') {

    var body = "";
  request.on('data', function (chunk) {
    body += chunk;
  });
  request.on('end', function () {
    resolve(body);
    console.log('POST: ' + body);
    response.writeHead(200 );
    
  });}
}).listen(port,function(){
  console.log("Server listening at port "+port);
});
});
}



async function putData() {
  let rawData = await getData();

  let rawArr = rawData.split("\r\n");

   let nameArr = rawArr[0].split("=");
   let name = nameArr[1];

   let emailArr = rawArr[1].split("=");
   let email = decodeURIComponent(emailArr[emailArr.length - 1]);
   
  
   let url = rawArr[2].substr(4);

   

   let numArr = rawArr[3].split("=");
   let num = Number(numArr[numArr.length - 1]);

   
   let sql  = "insert into work(email,url,cheapestPrice,currentPrice,highestPrice,remaining) values ('"+email+"','"+url+"',null,null,null,"+num+")";

   db = new sqlite3.Database('./letstrackit.db',sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    return console.error(err.message);}
console.log('Connected to letstrackit.db');
});

   db.run(sql, function(err){
    if(err)console.log(err);
    console.log(this.changes +' row(s) inserted');

  });
}
putData();