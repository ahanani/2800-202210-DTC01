let http = require('http');
let formidable = require('formidable');
let fs = require('fs');
const express = require('express');
const app = express();
const csvparser = require('./csvreader');

app.get('/', function(req, res){
  res.sendFile(__dirname + "/upload.html");
});

app.post('/upload', function(req, res){
       //Create an instance of the form object
  let form = new formidable.IncomingForm();



  //Process the file upload in Node
  form.parse(req, function (error, fields, file) {
    let filepath = file.fileupload.filepath;
    let newpath = __dirname + '/' + file.fileupload.originalFilename;
    //newpath += file.fileupload.originalFilename;
    //Copy the uploaded file to a custom folder
    fs.rename(filepath, newpath, function () {

      console.log(csvparser(newpath, (result)=>{
        
        fs.unlinkSync(newpath)
        res.send(result)}));


      
      
      //res.send('NodeJS File Upload Success!');
    });
  });
});








app.listen(5000);

// http.createServer(function (req, res) {

//   //Create an instance of the form object
//   let form = new formidable.IncomingForm();

//   //Process the file upload in Node
//   form.parse(req, function (error, fields, file) {
//     let filepath = file.fileupload.filepath;
//     let newpath = 'C:/Users/amin5/Desktop/myfeature';
//     newpath += file.fileupload.originalFilename;

//     //Copy the uploaded file to a custom folder
//     fs.rename(filepath, newpath, function () {
//       //Send a NodeJS file upload confirmation message
//       res.write('NodeJS File Upload Success!');
//       res.end();
//     });
//   });

// }).listen(5000);


















// const express = require('express')
// const csvparser = require('./csvreader');
// const bodyparser = require("body-parser")
// const app = express();
// app.use(bodyparser.urlencoded({extended: true}));
// app.use(bodyparser.json())


// // app.get('/', (req, res) => {
// //     res.send('root dir');
// // })


// app.post('/', (req, res) => {

//     console.log(req.query);

//     res.send('hi');
   
// })




// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
