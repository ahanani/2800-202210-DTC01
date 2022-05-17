const fs = require('fs');
const parsemod = require('csv-parse');
const parse = parsemod.parse;

function csvParser(path, next) {
    let csvData = [];
    fs.createReadStream(path)
        .pipe(parse({ delimiter: ',' }))
        .on('data', function (csvrow) {
            csvData.push(csvrow);
        })
        .on('end', function () {
            next(csvData);
            
        }).on('error', (err) => console.log(err));

       
}


module.exports = csvParser;



