const express = require("express");
const router = express.Router();
const User = require("../model/user");

router.post("/updateUserPermission", async (req, res) => {
    try {
        console.log("call from client");
        const { email, type } = req.body;

        const userExist = await User.findOne({ email: email });
        console.log(userExist);

        if (type === "Screen") {
            userExist.screenPermission = true;
        } else if (type === "Webcam") {
            userExist.webcamPermission = true;
            userExist.audioPermission = true;
        } else if (type === "Audio") {
            userExist.audioPermission = true;
        }

        const data = await userExist.save();

        if (data) {
            res.status(200).json({ message: "Permission updated successfully" });
        }

    } catch (err) {
        console.log(err);
    }
});

module.exports = router;