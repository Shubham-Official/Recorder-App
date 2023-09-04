const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// middlewares
app.use(express.json());
app.use(cors());
app.use(require("./router/auth"));
app.use(require("./router/permission"));
app.use(require("./router/session"));


// routes
app.get("/message", (req, res) => {
    console.log("Success!");
    res.json({ message: "Hello there!" });
});

mongoose.connect("mongodb+srv://E-commerce:k9VsnWqU7gGzI6vI@atlascluster.2wqf5jm.mongodb.net/Test-App-db?retryWrites=true&w=majority")
    .then((res) => {
        console.log("connected Successfully");
        app.listen(8000);
    })
    .catch(err => console.log(err));