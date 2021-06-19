// ASSINGMENT-10

const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const fs = require("fs-extra");

// const ObjectId = require('mongodb').ObjectID;
// const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");

require("dotenv").config();

// require
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("doctors"));
app.use(fileUpload());

const port = process.env.PORT || 5000;

// mongoDB connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vvccs.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// console.log(uri);
// set Uri
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const appoitmentCollection = client
    .db("doctorPortalData")
    .collection("appointments");
   const doctortCollection = client
    .db("doctorPortalData")
    .collection("doctor");  
  // perform actions on the collection object
  console.log("Data-Base connection successfully");

  // data post
  app.post("/addAppointment", (req, res) => {
    const appoinment = req.body;
    console.log(appoinment);
    appoitmentCollection.insertOne(appoinment).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/appointmentByDate", (req, res) => {
    const date = req.body;
        const email = req.body.email;
        doctorCollection.find({ email: email })
            .toArray((err, doctors) => {
                const filter = { date: date.date }
                if (doctors.length === 0) {
                    filter.email = email;
                }
                appointmentCollection.find(filter)
                    .toArray((err, documents) => {
                        console.log(email, date.date, doctors, documents)
                        res.send(documents);
                    })
            })

  });

  app.post("/addADoctor", (req, res) => {
    const file = req.files.file;
        const name = req.body.name;
        const email = req.body.email;
        const newImg = file.data;
        const encImg = newImg.toString('base64');

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };

        doctorCollection.insertOne({ name, email, image })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
})




app.get('/doctors', (req, res) => {
    doctorCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
});

  // data get
  app.get("/appointments", (req, res) => {
    appoitmentCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!, This is Doctors Portal");
});

app.listen(port);
