
const socket = io();

const myFace = document.querySelector('#myFace');
const muteBtn = document.querySelector("#mute")
const cameraBtn = document.querySelector('#camera')
const camerasSelect = document.querySelector('#cameras')
// stream 은 비디오와 오디오가 결합된 것

let myStream;
let muted = false;
let cameraOff = false;

async function getCameras() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        const cameras = devices.filter(device=> device.kind === 'videoinput')
        console.log(cameras)
        cameras.map(camera => {
            const option = document.createElement('option');
            option.value = camera.deviceId;
            option.innerText = camera.label
            camerasSelect.appendChild(option)
        })
    } catch (error) {
        console.log(error)
    }
}

async function getMedia() {
    try {
        myStream = await navigator.mediaDevices.getUserMedia({
            audio : true,
            video :true
        })
        console.log(myStream)
        myFace.srcObject = myStream
        await getCameras();
    }
    catch (e) {
        console.log(e)
    }
}

getMedia();

function handleMuteClick() {
    console.log(myStream.getAudioTracks());
    myStream.getAudioTracks().forEach(track=>track.enabled =!track.enabled)
    if (!muted) {
        muteBtn.innerHTML = 'Unmute'
        muted = true;
    } else {
        muteBtn.innerHTML = 'Mute'
        muted = false;
    }
}
function handlecameraClick() {
    myStream.getVideoTracks().forEach(track=>track.enabled =!track.enabled)
    if (cameraOff) {
        cameraBtn.innerText = "Turn Camera Off"
        cameraOff = false;
    } else {
        cameraBtn.innerText = "Turn Camera On"
        cameraOff = true;
    }
}
muteBtn.addEventListener("click", handleMuteClick)
cameraBtn.addEventListener("click", handlecameraClick)