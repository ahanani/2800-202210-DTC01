const fs = require('fs');
const parsemod = require('csv-parse');
const sessiondb = require('./session-db');
const formidable = require('formidable');
const parse = parsemod.parse;

function csvParser(path, next) {
    let csvData = [];
    fs.createReadStream(path)
        .pipe(parse({ delimiter: ',' }))
        .on('data', function(csvrow) {
            csvData.push(csvrow);
        })
        .on('end', function() {
            next(csvData);

        }).on('error', (err) => console.log(err));

}

function formatResult(arr) {
    let result = [];
    for (let i = 1; i < arr.length; ++i) {
        let obj = {}
        for (let j = 0; j < arr[i].length; ++j) {
            obj[arr[0][j]] = arr[i][j];
        }
        result.push(obj);
    }

    return result;
}


function insertPurchase(req, res, username) {
    let form = new formidable.IncomingForm();
    form.parse(req, function(error, fields, file) {
        let filepath = file.fileupload.filepath;
        let newpath = __dirname + '/' + file.fileupload.originalFilename;

        fs.rename(filepath, newpath, function() {





            csvParser(newpath, (result) => {

                result = formatResult(result);

                fs.unlinkSync(newpath)

                for (let i = 0; i < result.length; ++i) {
                    sessiondb.insertCsvItem(username, result[i]);
                }
                res.send(result);
            });

        });
    });
}

module.exports = { insertPurchase };















// csvparser(newpath, (result) => {

//     result = formatResult(result);

//     fs.unlinkSync(newpath)
//     sessiondb.connect();

//     for (let i = 0; i < result.length; ++i) {
//         sessiondb.insertCsvItem(username, result[i]);
//     }
//     res.send(result);
// });


// csvparser(newpath, (result) => {

//     result = formatResult(result);

//     fs.unlinkSync(newpath)
//     sessiondb.connect();

//     for (let i = 0; i < result.length; ++i) {
//         sessiondb.insertCsvItem(username, result[i]);
//     }
//     res.send(result);
// });