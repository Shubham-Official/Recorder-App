const express = require("express");
const router = express.Router();
const User = require("../model/user")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//test route
router.get("/", (req, res) => {
    res.send("Hello from server router!");
});

//Getting Signup Data from client and storing it in mongodb database.
router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    //checking for empty fields
    if (!name || !email || !password) {
        return res.status(422).json({ error: "Fields cannot be empty!" });
    }

    try {
        const userExist = await User.findOne({ email: email });

        if (userExist) {
            return res.status(422).json({ error: "Email already exists! Login instead" });
        }

        //Hashing Password
        const hashedPwd = await bcrypt.hash(password, 12);

        const user = new User({
            name,
            email,
            password: hashedPwd, //storing hashed password
        })

        const newUser = await user.save();

        if (newUser) {
            res.status(201).json({ message: "User registered successfully" });
        }
    } catch (err) {
        console.log(err);
    }
});

//Getting login data from client and processing it.
router.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;

        //checking for empty fields
        if (!email || !password) {
            return res.status(400).json({ error: "Fields cannot be empty!" });
        }

        const user = await User.findOne({ email: email });

        //if user found, then check for password using bcrypt compare.
        if (user) {
            const checkPwd = await bcrypt.compare(password, user.password);
            // console.log(checkPwd);

            if (!checkPwd) {
                res.status(400).json({ error: "Invalid credentials" })
            } else {
                //signing user with jwt token after checking user credentials
                const token = jwt.sign({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                }, "my_Secret_Key");

                res.status(200).json({ message: "Login Successful", user: token });//Passing token as json (can be accessed using localStorage, we can also use cookies and session)
            }
        } else {
            res.status(400).json({ error: "User not found!" });
        }
    } catch (err) {
        console.log(err);
    }
})

module.exports = router;