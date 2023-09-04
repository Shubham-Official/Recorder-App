import React, { useEffect, useState, useRef } from 'react';
import jwt_decode from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import { useReactMediaRecorder } from "react-media-recorder-2";

//The below code is from react-media-recorder to show the live preview to the user.
const VideoPreview = ({ stream }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    if (!stream) {
        return null;
    }

    return <video ref={videoRef} width={800} height={500} autoPlay controls />;
};

function Home() {
    const navigate = useNavigate();
    const [userExist, setUserExist] = useState({});
    const [isRecording, setIsRecording] = useState(false);
    const [startTime, setStartTime] = useState("");
    const [videoStart, setVideoStart] = useState(0);
    let endTime = "";
    let videoEnd = 0;

    //if screen is true then it will record screen and respectively for the other two types i.e. video and audio
    const [recordingType, setRecordingType] = useState({
        screen: true,
        webcam: false,
        audio: false,
    })

    //Setting up media recorder using react library.
    const { status, startRecording, stopRecording, mediaBlobUrl, previewStream } =
        useReactMediaRecorder(recordingType);

    //Adding authentication with the token signed from server.
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            const user = jwt_decode(token); //Decoding token to get user info
            if (!user) {
                localStorage.removeItem("token");
                navigate("/login");
            }

            setUserExist(user);
        } else {
            //if token not received from server, redirect to login page.

            localStorage.removeItem("token");
            navigate("/login");
        }
    }, [navigate]);

    const handlePermission = async (recordType) => {
        const data = await fetch("http://localhost:8000/updateUserPermission", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: userExist.email, // email of user logged in 
                type: recordType, // specifies recording type
            }),
        });

        const dataJson = await data.json();

        if (dataJson) {
            console.log("Permission updated Successfully");
        }
    };

    const handleTypeSel = async (e) => {
        let recordType = e.target.id; //We have provided id to the div element below i.e. screen, webcam, audio

        if (recordType === "Screen") {
            //We can ask for permission here, when we are selecting the recording type.
            try {
                // API to invoke ask permission, returns a promise
                const permission = await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                })

                if (permission) {
                    handlePermission(recordType);
                }
            } catch (err) {
                console.log(err);
            }
            setRecordingType({
                screen: true,
                video: false,
                audio: false,
            });
            window.alert("Screen will be recorded");
        } else if (recordType === "Webcam") {
            try {
                const permission = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                })

                if (permission) {
                    handlePermission(recordType);
                }
            } catch (err) {
                console.log(err);
            }
            setRecordingType({
                screen: false,
                video: true,
                audio: true,
            });
            window.alert("Webcam will be recorded");
        } else if (recordType === "Audio") {
            try {
                const permission = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                })

                if (permission) {
                    handlePermission(recordType);
                }
            } catch (err) {
                console.log(err);
            }
            setRecordingType({
                screen: false,
                video: false,
                audio: true,
            });
            window.alert("Audio will be recorded");
        }
    }

    // Function to handle start recording
    const handleStartRecording = () => {
        setIsRecording(true);
        startRecording();
        setStartTime(new Date().toLocaleString());
        setVideoStart(new Date().getTime());
    }

    // Function to handle stop recording
    const handleStopRecording = () => {
        setIsRecording(false);
        stopRecording();
        endTime = new Date().toLocaleString();
        videoEnd = new Date().getTime();
        handleStopRecData();
    }

    //Call to server to send the recording data and store it in the database.
    const handleStopRecData = async () => {
        const data = await fetch("http://localhost:8000/recordSession", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user: userExist._id,
                startTime,
                endTime,
                duration_in_seconds: (videoEnd - videoStart) / 1000,
                //If we use database servers like aws or azure, then proper path of the recording should be stored, currently I am storing my local download path.
                filePath: "downloads/video.mp4",
            })
        });

        const dataJson = await data.json();

        if (dataJson.error || !data) {
            console.log("Failed to Fetch");
        } else {
            console.log(dataJson);
        }
    }

    return (

        < div >
            <div className='sel-btn'>
                <div className="home-container" id='Screen' onClick={handleTypeSel}>
                    <div className='start-rec' id="Screen">Screen</div>
                </div>
                <div className="home-container" id='Webcam' onClick={handleTypeSel}>
                    <div className='start-rec' id='Webcam'>Webcam</div>
                </div>
                <div className="home-container" id='Audio' onClick={handleTypeSel}>
                    <div className='start-rec' id='Audio'>Audio</div>
                </div>
            </div>

            {/* This line of code is for live Preview of the recording, this feature can be removed also. */}
            {isRecording && <VideoPreview stream={previewStream} />}
            {
                (!isRecording || status !== "recording") && (<video src={mediaBlobUrl} width={800} height={500} controls autoPlay
                    poster="https://img.freepik.com/premium-vector/rec-icon-record-button-video-recording-concept-start-recording-audio-video-camera-livestream_476325-1765.jpg?w=2000" />)
            }

            <div className="home-container" onClick={status === "idle" ? handleStartRecording : handleStopRecording}>
                <div className='rec-img'><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS64W5r4Kr_RpC_oMhJWZBJUjGn2VRH-YdfJA&usqp=CAU" alt="img" /></div>
                <div className='start-rec'>{status !== "recording" ? "Start" : "Stop"} Recording</div>
            </div>
        </ div >
    );
}

export default Home;