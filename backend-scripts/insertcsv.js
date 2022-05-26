const fs = require('fs');
const csvparse = require('csv-parse');
const formidable = require('formidable');
//const { rawListeners } = require('process');
const db = require('./db');
const parse = csvparse.parse;

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

function formatCsvResult(arr) {
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

function processPurchase(req, res, next) {
    let form = new formidable.IncomingForm();
    form.parse(req, function(error, fields, file) {
        let filepath = file.fileupload.filepath;
        let newpath = __dirname + '/' + file.fileupload.originalFilename;
        fs.rename(filepath, newpath, function() {
            csvParser(newpath, (result) => {
                const formatted = formatCsvResult(result);
                fs.unlinkSync(newpath)
                for (let i = 0; i < formatted.length; ++i) {
                    db.insertCsvItem(req.session.username, formatted[i]);
                }
                next();
                //res.redirect(`/landingPage/${req.session.name}`);
            });
        });
    });
}

function processCompany(req, res, next) {
    let form = new formidable.IncomingForm();
    form.parse(req, function(error, fields, file) {
        let filepath = file.fileupload.filepath;
        let newpath = __dirname + '/' + file.fileupload.originalFilename;
        fs.rename(filepath, newpath, function() {
            csvParser(newpath, (result) => {
                const formatted = formatCsvResult(result);
                fs.unlinkSync(newpath)
                for (let i = 1; i < formatted.length; ++i) {
                    db.insertCompany(formatted[i]);
                }
                next();
            });
        });
    });
}


module.exports = { processPurchase, processCompany };