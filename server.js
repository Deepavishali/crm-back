/**
 * This file will be the start point of the application.
 */
const serverConfig = require('./configs/server.config');
const dbConfig = require('./configs/db.config');
const mongoose = require('mongoose');
const User = require('./models/user.model');
const express = require('express');
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Configuring CORS
 * Current configuration ensures access from everywhere
 * Think twice, while doing the same in the Production.
 * 
 * Why ? Make sure you ask your doubt in the sessions :P 
 */
app.use(cors());




/**
 * DB Connection initialization
 */
mongoose.connect(dbConfig.DB_URL);
const db = mongoose.connection;
db.on("error", () => {
    console.log("error while connecting to DB");
});
db.once("open", () => {
    console.log("connected to Mongo DB ")
    init();
})

/**
 * 
 *  
 * This method is for the demonstration purpose,
 * ideally one ADMIN user should have been created in the backend
 */
async function init() {
    var user = await User.findOne({ userId: "deepavishalig-admin" });
    if (user) {
        console.log("Admin user already present");
        return;
    }
    try {
        user = await User.create({
            name: "Admin",
            userId: "admin", // It should be atleat 16, else will throw error
            email: "admin@gmail.com",  // If we don't pass this, it will throw the error
            userType: "ADMIN",
            password: bcrypt.hashSync("qwerty123", 8) //this field should be hidden from the end user
        });
    } catch (err) {
        console.log(err.message);
    }

}



/**
 * importing the routes
 */
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/ticket.routes')(app);

app.get('/', (req, res) => {
    res.json({
        "title": "This is a CRM Application.",
        "message": "Hello world"
    })
})
const port = process.env.PORT
app.listen(port, () => {
    console.log(`Application started on the port num : ${port}`);
})
