const express = require("express");
const router = express.Router();
const Recording = require("../model/recordings");

//Client will send recoding data to this route, and it will be processed to the database.
router.post("/recordSession", async (req, res) => {
    try {
        const { user, startTime, endTime, duration_in_seconds, filePath } = req.body;

        const recording = new Recording({
            user,
            startTime,
            endTime,
            duration_in_seconds,
            filePath,
        });

        const newRecording = await recording.save();

        if (newRecording) {
            console.log(newRecording);
            res.status(200).json({ message: "Recording created Successfully" });
        }
    } catch (err) {
        console.log(err)
    }
});

module.exports = router;