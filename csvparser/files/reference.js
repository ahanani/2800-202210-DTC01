const express = require('express');
const { read } = require('fs');
const https = require('https');
const bodyparser = require("body-parser");
const mongoose = require('mongoose');
const app = express()
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(bodyparser.urlencoded({
  extended: true
}));
const cors = require('cors');
app.use(cors());


mongoose.connect("mongodb://localhost:27017/log",
  { useNewUrlParser: true, useUnifiedTopology: true });
const logSchema = new mongoose.Schema({
  id: Number,
  likes: Number,
  dislikes: Number
});
const poklogsModel = mongoose.model("poklogs", logSchema);

app.get('/log/poklogs', function (req, res) {
  poklogsModel.find({}, { _id: 0, id: 1, likes: 1, dislikes: 1 }, function (err, logs) {
    if (err) {
      console.log("Error " + err);
    } else {
      res.json(logs);
    }

  });
})

app.get('/log/poklogs/:id', function (req, res) {
  poklogsModel.find({ "id": req.params.id }, { _id: 0, id: 1, likes: 1, dislikes: 1 }, function (err, logs) {
    if (err) {
      console.log("Error " + err);
    } else {
      res.json(logs);
    }

  });
})


app.put('/log/insert', function (req, res) {
  poklogsModel.create({
    "id": req.query.id,
    "likes": req.query.likes,
    "dislikes": req.query.dislikes

  }, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      res.send(`inserted ${req.query.id}, ${req.query.likes}, ${req.query.dislikes}`);
    }

  });
})


app.get('/log/like/:id', function (req, res) {
  poklogsModel.updateOne({
    "id": req.params.id
  }, {
    $inc: { "likes": 1 }
  }, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      poklogsModel.find({ 'id': req.params.id }, { _id: 0, id: 1, likes: 1 }, function (err, logs) {
        if (err) {
          console.log("Error " + err);
        } else {
          res.send(logs);
        }

      });
    }
  });
})


app.get('/log/dislike/:id', function (req, res) {
  poklogsModel.updateOne({
    "id": req.params.id
  }, {
    $inc: { "dislikes": 1 }
  }, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      poklogsModel.find({ 'id': req.params.id }, { _id: 0, id: 1, dislikes: 1 }, function (err, logs) {
        if (err) {
          console.log("Error " + err);
        } else {
          res.send(logs);
        }

      });
    }
  });
})


app.get('/log/remove/:id', function (req, res) {
  poklogsModel.remove({
    "id": req.params.id
  }, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {

      res.send(`Remove id= ${req.params.id} log record`);
    }

  });
})



const pokSchema = new mongoose.Schema({
  "id": Number,
  "name": String,
  "weight": Number,
  "height": Number,
  "species": String,
  "type": Array
});
const poksModel = mongoose.model("poks", pokSchema);

app.get('/pok/:id', function (req, res) {
  poksModel.find({ id: req.params.id }, { _id: 0, id: 1, name: 1, weight: 1, height: 1, species: 1, type: 1 }, function (err, poks) {
    if (err) {
      console.log("Error " + err);
    } else {
      res.json(poks[0]);
    }
  });
})


app.get('/profile/:id', function (req, res) {

  poksModel.find({ "id": req.params.id }, { _id: 0, id: 1, name: 1, weight: 1, height: 1, species: 1 }, function (err, properties) {
    if (err) {
      console.log("Error " + err);
    } else {
      res.render("profile.ejs", {
        "id": properties[0].id,
        "name": properties[0].name,
        "weight": properties[0].weight,
        "height": properties[0].height,
        "species": properties[0].species
      });
    }
  });
});




function removePokLogs() {
  poklogsModel.remove({}, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log('Removed all pok logs from db');
    }
  });

}

function removePoks() {
  poksModel.remove({}, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log('Removed all poks from db');
    }
  });
}


function remove() {
  poklogsModel.count({}, function (err, count) {
    if (err) {
      console.log("Error " + err);
    } else if (count != 0) {
      removePokLogs();
    }

  });


  poksModel.count({}, function (err, count) {
    if (err) {
      console.log("Error " + err);
    } else if (count != 0) {
      removePoks();
    }

  });

}

function populateDB() {
  remove();
  for (let i = 1; i <= 40; ++i) {
    https.get(`https://pokeapi.co/api/v2/pokemon/${i}`, (resp) => {
      let data = '';

      
      resp.on('data', (chunk) => {
        data += chunk;
      });

     
      resp.on('end', () => {
        let properties = JSON.parse(data);
        let poktypes = [];

        for (let i = 0; i < properties.types.length; ++i) {
          poktypes.push(properties.types[i].type.name);
        }
       

        poksModel.count({ "id": parseInt(properties.id) }, function (err, count) {
          if (err) {
            console.log("Error " + err);
          } else if (count == 0) {
            poksModel.create({
              "id": parseInt(properties.id),
              "name": properties.name,
              "weight": parseInt(properties.weight),
              "height": parseInt(properties.height),
              "species": properties.species.name,
              "type": poktypes
            });
          }

        });
        poksModel.count({ "id": parseInt(properties.id) }, function (err, count) {
          if (err) {
            console.log("Error " + err);
          } else if (count == 0) {
            poklogsModel.create({
              "id": parseInt(properties.id),
              likes: 0,
              dislikes: 0
            });
          }

        });
      });

    }).on("error", (err) => {
      console.log("Error: " + err.message);
    })
  }

}

populateDB();

// app.get('/reload', function (req, res) {



//   remove();
//   for (let i = 1; i <= 30; ++i) {
//     https.get(`https://pokeapi.co/api/v2/pokemon/${i}`, (resp) => {
//       let data = '';

//       // A chunk of data has been received.
//       resp.on('data', (chunk) => {
//         data += chunk;
//       });

//       // The whole response has been received. Print out the result.
//       resp.on('end', () => {
//         let properties = JSON.parse(data);
//         let poktypes = [];

//         for (let i = 0; i < properties.types.length; ++i) {
//           poktypes.push(properties.types[i].type.name);
//         }
//         // poksModel.create({
//         //   "id": parseInt(properties.id),
//         //   "name": properties.name,
//         //   "weight": parseInt(properties.weight),
//         //   "height": parseInt(properties.height),
//         //   "species": properties.species.name,
//         //   "type": poktypes
//         // });


//         poksModel.count({ "id": parseInt(properties.id) }, function (err, count) {
//           if (err) {
//             console.log("Error " + err);
//           } else if (count == 0) {
//             poksModel.create({
//               "id": parseInt(properties.id),
//               "name": properties.name,
//               "weight": parseInt(properties.weight),
//               "height": parseInt(properties.height),
//               "species": properties.species.name,
//               "type": poktypes
//             });
//           }

//         });




//         // poklogsModel.create({
//         //   "id": parseInt(properties.id),
//         //   likes: 0,
//         //   dislikes: 0
//         // });


//         poksModel.count({ "id": parseInt(properties.id) }, function (err, count) {
//           if (err) {
//             console.log("Error " + err);
//           } else if (count == 0) {
//             console.log('count: ', count);
//             poklogsModel.create({
//               "id": parseInt(properties.id),
//               likes: 0,
//               dislikes: 0
//             });
//           }

//         });
//       });

//     }).on("error", (err) => {
//       console.log("Error: " + err.message);
//     })
//   }







//   res.json({ "bad": "good" });
// });










// app.get('/profile/:id', function (req, res) {


//   https.get(`https://pokeapi.co/api/v2/pokemon/${req.params.id}`, (resp) => {
//     let data = '';

//     // A chunk of data has been received.
//     resp.on('data', (chunk) => {
//       data += chunk;
//     });

//     // The whole response has been received. Print out the result.
//     resp.on('end', () => {
//       // console.log(JSON.parse(data).explanation);
//       let properties = JSON.parse(data);

//       res.render("profile.ejs", {
//         "id": properties.id,
//         "name": properties.name,
//         "weight": properties.weight,
//         "height": properties.height,
//         "species": properties.species.name
//       });

//     });

//   }).on("error", (err) => {
//     console.log("Error: " + err.message);
//   })

// });












app.listen(5000, function (err) {
  if (err)
    console.log(err);
});





